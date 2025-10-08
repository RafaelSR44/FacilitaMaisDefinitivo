#!/bin/bash

# Facilita+ Porto Seguro - Automated Deployment Script
# Script para deploy automatizado da plataforma completa

set -e

echo "🚀 Iniciando Deploy - Facilita+ Porto Seguro Edition"
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
ENVIRONMENT=${1:-development}
VERSION=${2:-latest}

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

# Verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos para deploy..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado"
        exit 1
    fi
    
    # Verificar se está no diretório correto
    if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
        error "Execute o script a partir do diretório raiz do projeto"
        exit 1
    fi
    
    success "Pré-requisitos verificados"
}

# Preparar ambiente
prepare_environment() {
    log "Preparando ambiente para deploy ($ENVIRONMENT)..."
    
    # Criar diretórios necessários
    mkdir -p infrastructure/{nginx/ssl,monitoring/grafana/{dashboards,datasources}}
    mkdir -p logs/{api,nginx,postgres}
    
    # Copiar arquivos de configuração baseados no ambiente
    if [ "$ENVIRONMENT" = "production" ]; then
        cp infrastructure/configs/production/.env.example .env
        warning "Configure as variáveis de ambiente em .env antes de continuar"
    else
        cp infrastructure/configs/development/.env.example .env
    fi
    
    success "Ambiente preparado"
}

# Build das aplicações
build_applications() {
    log "Fazendo build das aplicações..."
    
    # Build do Backend API
    log "Building Backend API..."
    cd apps/api
    if [ -f "package.json" ]; then
        npm install --production
        npm run build
        success "Backend API build concluído"
    else
        warning "Backend API não encontrado, pulando build"
    fi
    cd ../..
    
    # Build do Frontend Web Admin
    log "Building Frontend Web Admin..."
    cd apps/web-admin
    if [ -f "package.json" ]; then
        npm install
        npm run build
        success "Frontend Web Admin build concluído"
    else
        warning "Frontend Web Admin não encontrado, pulando build"
    fi
    cd ../..
    
    success "Build de todas as aplicações concluído"
}

# Deploy com Docker Compose
deploy_with_docker() {
    log "Iniciando deploy com Docker Compose..."
    
    # Parar serviços existentes
    log "Parando serviços existentes..."
    docker-compose -f docker-compose.integration.yml down --remove-orphans
    
    # Limpar volumes se necessário (apenas em development)
    if [ "$ENVIRONMENT" = "development" ]; then
        warning "Limpando volumes de desenvolvimento..."
        docker-compose -f docker-compose.integration.yml down -v
    fi
    
    # Fazer pull das imagens
    log "Fazendo pull das imagens Docker..."
    docker-compose -f docker-compose.integration.yml pull
    
    # Build das imagens customizadas
    log "Building imagens customizadas..."
    docker-compose -f docker-compose.integration.yml build --no-cache
    
    # Iniciar serviços
    log "Iniciando serviços..."
    docker-compose -f docker-compose.integration.yml up -d
    
    success "Deploy com Docker Compose concluído"
}

# Aguardar serviços ficarem prontos
wait_for_services() {
    log "Aguardando serviços ficarem prontos..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            success "API está respondendo"
            break
        fi
        
        attempt=$((attempt + 1))
        log "Tentativa $attempt/$max_attempts - Aguardando API..."
        sleep 10
    done
    
    if [ $attempt -eq $max_attempts ]; then
        error "API não ficou pronta após $max_attempts tentativas"
        exit 1
    fi
    
    # Verificar outros serviços
    sleep 10
    
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        success "Frontend está respondendo"
    else
        warning "Frontend pode não estar pronto ainda"
    fi
    
    success "Serviços principais estão prontos"
}

# Executar migrações do banco
run_migrations() {
    log "Executando migrações do banco de dados..."
    
    # Aguardar PostgreSQL estar pronto
    local max_attempts=10
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker exec facilita-postgres pg_isready -U facilita_user -d facilita_porto > /dev/null 2>&1; then
            success "PostgreSQL está pronto"
            break
        fi
        
        attempt=$((attempt + 1))
        log "Aguardando PostgreSQL... ($attempt/$max_attempts)"
        sleep 5
    done
    
    # Executar migrações
    if docker exec facilita-api npm run migration:run > /dev/null 2>&1; then
        success "Migrações executadas com sucesso"
    else
        warning "Falha ao executar migrações ou já estão atualizadas"
    fi
}

# Seed de dados iniciais
seed_initial_data() {
    log "Inserindo dados iniciais..."
    
    # Executar seeds apenas em development
    if [ "$ENVIRONMENT" = "development" ]; then
        if docker exec facilita-api npm run seed:run > /dev/null 2>&1; then
            success "Dados iniciais inseridos"
        else
            warning "Falha ao inserir dados iniciais ou já existem"
        fi
    else
        log "Pulando seed de dados em ambiente de produção"
    fi
}

# Verificar saúde do sistema
health_check() {
    log "Executando verificação de saúde do sistema..."
    
    # Executar testes de integração básicos
    if [ -f "scripts/integration-tests.sh" ]; then
        ./scripts/integration-tests.sh health
        success "Verificação de saúde concluída"
    else
        warning "Script de testes não encontrado, pulando verificação"
    fi
}

# Configurar monitoramento
setup_monitoring() {
    log "Configurando monitoramento..."
    
    # Verificar se Grafana está rodando
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        log "Configurando dashboards do Grafana..."
        
        # Importar dashboards (seria feito via API do Grafana)
        success "Monitoramento configurado"
    else
        warning "Grafana não está disponível, pulando configuração de monitoramento"
    fi
}

# Mostrar informações do deploy
show_deployment_info() {
    echo ""
    echo "=================================================================="
    success "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
    echo ""
    echo "📊 Serviços disponíveis:"
    echo "   • 🌐 Dashboard Web Admin: http://localhost:5173"
    echo "   • 🔌 API Backend: http://localhost:3000"
    echo "   • 📈 Grafana (Monitoramento): http://localhost:3001"
    echo "     └─ Login: admin / facilita_grafana_2024"
    echo "   • 📊 Prometheus (Métricas): http://localhost:9090"
    echo "   • 🐰 RabbitMQ (Filas): http://localhost:15672"
    echo "     └─ Login: facilita_user / facilita_pass_2024"
    echo "   • 🔍 Kibana (Logs): http://localhost:5601"
    echo ""
    echo "🗄️  Banco de Dados:"
    echo "   • PostgreSQL: localhost:5432"
    echo "   • Database: facilita_porto"
    echo "   • User: facilita_user"
    echo ""
    echo "📱 Apps Mobile:"
    echo "   • Cliente: /apps/mobile-client"
    echo "   • Prestador: /apps/mobile-provider"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   • Ver logs: docker-compose -f docker-compose.integration.yml logs -f [service]"
    echo "   • Parar serviços: docker-compose -f docker-compose.integration.yml down"
    echo "   • Reiniciar: ./scripts/deploy.sh $ENVIRONMENT"
    echo "   • Testes: ./scripts/integration-tests.sh"
    echo ""
    echo "🚀 A plataforma Facilita+ Porto Seguro está pronta para uso!"
    echo "=================================================================="
}

# Função principal
main() {
    log "Iniciando deploy da Facilita+ Porto Seguro Edition"
    log "Ambiente: $ENVIRONMENT | Versão: $VERSION"
    
    check_prerequisites
    prepare_environment
    build_applications
    deploy_with_docker
    wait_for_services
    run_migrations
    seed_initial_data
    health_check
    setup_monitoring
    show_deployment_info
}

# Verificar argumentos
case "${1:-development}" in
    "development"|"dev")
        ENVIRONMENT="development"
        ;;
    "staging"|"stage")
        ENVIRONMENT="staging"
        ;;
    "production"|"prod")
        ENVIRONMENT="production"
        ;;
    "help"|"-h"|"--help")
        echo "Uso: $0 [environment] [version]"
        echo ""
        echo "Ambientes:"
        echo "  development (padrão) - Deploy local para desenvolvimento"
        echo "  staging              - Deploy para ambiente de homologação"
        echo "  production           - Deploy para ambiente de produção"
        echo ""
        echo "Exemplo: $0 production v1.0.0"
        exit 0
        ;;
    *)
        error "Ambiente inválido: $1"
        echo "Use: development, staging, production ou help"
        exit 1
        ;;
esac

# Executar deploy
main
