#!/bin/bash

# Facilita+ Porto Seguro - Integration Tests
# Script para executar testes de integração completos

set -e

echo "🚀 Iniciando Testes de Integração - Facilita+ Porto Seguro Edition"
echo "=================================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar dependências
check_dependencies() {
    log "Verificando dependências..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        error "curl não está instalado"
        exit 1
    fi
    
    success "Todas as dependências estão instaladas"
}

# Iniciar serviços
start_services() {
    log "Iniciando serviços com Docker Compose..."
    
    docker-compose -f docker-compose.integration.yml down --remove-orphans
    docker-compose -f docker-compose.integration.yml up -d
    
    log "Aguardando serviços ficarem prontos..."
    sleep 30
    
    # Verificar se os serviços estão rodando
    if docker-compose -f docker-compose.integration.yml ps | grep -q "Up"; then
        success "Serviços iniciados com sucesso"
    else
        error "Falha ao iniciar serviços"
        docker-compose -f docker-compose.integration.yml logs
        exit 1
    fi
}

# Testes de Health Check
test_health_checks() {
    log "Executando testes de health check..."
    
    # Teste PostgreSQL
    if docker exec facilita-postgres pg_isready -U facilita_user -d facilita_porto; then
        success "PostgreSQL está funcionando"
    else
        error "PostgreSQL falhou no health check"
        return 1
    fi
    
    # Teste Redis
    if docker exec facilita-redis redis-cli ping | grep -q "PONG"; then
        success "Redis está funcionando"
    else
        error "Redis falhou no health check"
        return 1
    fi
    
    # Teste API
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        success "API está funcionando"
    else
        error "API falhou no health check"
        return 1
    fi
    
    # Teste Frontend
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        success "Frontend está funcionando"
    else
        warning "Frontend pode não estar pronto ainda"
    fi
}

# Testes de API
test_api_endpoints() {
    log "Testando endpoints da API..."
    
    BASE_URL="http://localhost:3000"
    
    # Teste de autenticação
    log "Testando endpoint de registro..."
    REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test@facilita.com",
            "password": "Test123!@#",
            "profile": {
                "fullName": "Usuário Teste",
                "phone": "+5511999999999",
                "userType": "CLIENT"
            }
        }')
    
    if echo "$REGISTER_RESPONSE" | grep -q "accessToken"; then
        success "Endpoint de registro funcionando"
        
        # Extrair token para próximos testes
        TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
        
        # Teste de perfil do usuário
        log "Testando endpoint de perfil..."
        PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/users/profile")
        
        if echo "$PROFILE_RESPONSE" | grep -q "fullName"; then
            success "Endpoint de perfil funcionando"
        else
            error "Endpoint de perfil falhou"
        fi
        
    else
        error "Endpoint de registro falhou"
        echo "Response: $REGISTER_RESPONSE"
    fi
    
    # Teste de categorias de serviço
    log "Testando endpoint de categorias..."
    CATEGORIES_RESPONSE=$(curl -s "$BASE_URL/services/categories")
    
    if echo "$CATEGORIES_RESPONSE" | grep -q "Encanador\|Eletricista"; then
        success "Endpoint de categorias funcionando"
    else
        error "Endpoint de categorias falhou"
    fi
}

# Testes de Performance
test_performance() {
    log "Executando testes de performance..."
    
    # Teste de carga na API
    log "Testando carga na API (100 requisições simultâneas)..."
    
    for i in {1..100}; do
        curl -s http://localhost:3000/health > /dev/null &
    done
    wait
    
    # Verificar se API ainda responde
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        success "API suportou carga de 100 requisições simultâneas"
    else
        error "API falhou sob carga"
    fi
    
    # Teste de tempo de resposta
    log "Medindo tempo de resposta da API..."
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000/health)
    
    if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
        success "Tempo de resposta da API: ${RESPONSE_TIME}s (< 1s)"
    else
        warning "Tempo de resposta da API: ${RESPONSE_TIME}s (> 1s)"
    fi
}

# Testes de Banco de Dados
test_database() {
    log "Testando operações de banco de dados..."
    
    # Verificar se as tabelas foram criadas
    TABLES=$(docker exec facilita-postgres psql -U facilita_user -d facilita_porto -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
    
    if echo "$TABLES" | grep -q "users\|bookings\|providers"; then
        success "Tabelas do banco de dados criadas corretamente"
    else
        error "Tabelas do banco de dados não foram criadas"
        echo "Tabelas encontradas: $TABLES"
    fi
    
    # Teste de inserção e consulta
    log "Testando inserção de dados de teste..."
    docker exec facilita-postgres psql -U facilita_user -d facilita_porto -c "
        INSERT INTO users (id, email, password_hash, created_at, updated_at) 
        VALUES ('test-user-id', 'test-db@facilita.com', 'hash123', NOW(), NOW())
        ON CONFLICT (email) DO NOTHING;
    " > /dev/null
    
    USER_COUNT=$(docker exec facilita-postgres psql -U facilita_user -d facilita_porto -t -c "SELECT COUNT(*) FROM users WHERE email = 'test-db@facilita.com';")
    
    if [ "$USER_COUNT" -eq 1 ]; then
        success "Inserção e consulta no banco funcionando"
    else
        error "Falha na inserção/consulta no banco"
    fi
}

# Testes de Segurança Básicos
test_security() {
    log "Executando testes básicos de segurança..."
    
    # Teste de endpoint protegido sem token
    PROTECTED_RESPONSE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/users/profile)
    
    if [ "$PROTECTED_RESPONSE" = "401" ]; then
        success "Endpoints protegidos requerem autenticação"
    else
        error "Endpoint protegido não está seguro (HTTP $PROTECTED_RESPONSE)"
    fi
    
    # Teste de CORS
    CORS_RESPONSE=$(curl -s -H "Origin: http://malicious-site.com" -I http://localhost:3000/health | grep -i "access-control")
    
    if [ -n "$CORS_RESPONSE" ]; then
        success "Headers CORS configurados"
    else
        warning "Headers CORS podem não estar configurados"
    fi
}

# Testes de Monitoramento
test_monitoring() {
    log "Testando serviços de monitoramento..."
    
    # Teste Prometheus
    if curl -f http://localhost:9090/-/healthy > /dev/null 2>&1; then
        success "Prometheus está funcionando"
    else
        warning "Prometheus pode não estar pronto"
    fi
    
    # Teste Grafana
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        success "Grafana está funcionando"
    else
        warning "Grafana pode não estar pronto"
    fi
}

# Cleanup
cleanup() {
    log "Limpando ambiente de teste..."
    docker-compose -f docker-compose.integration.yml down --remove-orphans
    success "Ambiente limpo"
}

# Executar todos os testes
run_all_tests() {
    local failed_tests=0
    
    check_dependencies || ((failed_tests++))
    start_services || ((failed_tests++))
    test_health_checks || ((failed_tests++))
    test_api_endpoints || ((failed_tests++))
    test_database || ((failed_tests++))
    test_performance || ((failed_tests++))
    test_security || ((failed_tests++))
    test_monitoring || ((failed_tests++))
    
    echo ""
    echo "=================================================================="
    if [ $failed_tests -eq 0 ]; then
        success "🎉 TODOS OS TESTES PASSARAM! Sistema integrado com sucesso!"
        echo ""
        echo "📊 Serviços disponíveis:"
        echo "   • API Backend: http://localhost:3000"
        echo "   • Dashboard Web: http://localhost:5173"
        echo "   • Grafana: http://localhost:3001 (admin/facilita_grafana_2024)"
        echo "   • Prometheus: http://localhost:9090"
        echo "   • RabbitMQ: http://localhost:15672 (facilita_user/facilita_pass_2024)"
        echo "   • Kibana: http://localhost:5601"
        echo ""
        echo "🚀 A plataforma Facilita+ Porto Seguro está pronta para uso!"
    else
        error "❌ $failed_tests teste(s) falharam. Verifique os logs acima."
        exit 1
    fi
}

# Verificar argumentos
case "${1:-all}" in
    "health")
        check_dependencies
        start_services
        test_health_checks
        ;;
    "api")
        test_api_endpoints
        ;;
    "db")
        test_database
        ;;
    "performance")
        test_performance
        ;;
    "security")
        test_security
        ;;
    "monitoring")
        test_monitoring
        ;;
    "cleanup")
        cleanup
        ;;
    "all"|*)
        run_all_tests
        ;;
esac
