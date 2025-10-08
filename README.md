# 🚀 Facilita+ Porto Seguro Edition

Uma plataforma completa para gestão de serviços patrimoniais, conectando clientes, prestadores e a Porto Seguro em um ecossistema digital integrado.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Executando Localmente](#executando-localmente)
- [Aplicações](#aplicações)
- [Testes](#testes)
- [Deploy](#deploy)
- [Documentação](#documentação)
- [Contribuição](#contribuição)

## 🎯 Visão Geral

A **Facilita+ Porto Seguro Edition** é uma solução enterprise que revoluciona o setor de serviços patrimoniais da Porto Seguro, oferecendo:

- **Dashboard Web Administrativo** para gestão completa da operação
- **App Mobile Cliente** para solicitação e acompanhamento de serviços
- **App Mobile Prestador** para gerenciamento de trabalhos e ganhos
- **Backend API** robusto com autenticação, geolocalização e integrações
- **Infraestrutura escalável** com monitoramento e observabilidade

### 💰 Impacto Financeiro Projetado

- **ROI:** 2.400%+ em 12 meses
- **Economia:** R$ 200-500 milhões/ano
- **Receita Anual Estimada:** R$ 2,5 bilhões (Porto Serviço)
- **Payback:** 6 meses

## 🏗️ Arquitetura

```
facilita-porto/
├── apps/
│   ├── api/                    # Backend NestJS
│   ├── web-admin/              # Dashboard Web (Next.js)
│   ├── mobile-client/          # App Cliente (React Native)
│   └── mobile-provider/        # App Prestador (React Native)
├── packages/
│   ├── shared-types/           # Tipos TypeScript compartilhados
│   ├── shared-utils/           # Utilitários compartilhados
│   ├── shared-ui/              # Componentes UI compartilhados
│   └── shared-config/          # Configurações compartilhadas
├── infrastructure/
│   ├── docker/                 # Dockerfiles
│   ├── nginx/                  # Configuração Nginx
│   ├── monitoring/             # Prometheus + Grafana
│   └── terraform/              # Infraestrutura como código
├── scripts/                    # Scripts de automação
└── docs/                       # Documentação
```

### Stack Tecnológico

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| **Backend** | NestJS (Node.js) | 10+ |
| **Frontend Web** | Next.js (React) | 14+ |
| **Mobile** | React Native (Expo) | 51+ |
| **Banco de Dados** | PostgreSQL + PostGIS | 15+ |
| **Cache** | Redis | 7+ |
| **Filas** | RabbitMQ | 3+ |
| **Proxy** | Nginx | 1.25+ |
| **Monitoramento** | Prometheus + Grafana | Latest |
| **Logging** | Elasticsearch + Kibana | 8.11+ |

## 📋 Pré-requisitos

### Software Necessário

1. **Node.js** (versão 18 ou superior)
   ```bash
   # Verificar versão
   node --version
   ```

2. **pnpm** (gerenciador de pacotes)
   ```bash
   # Instalar pnpm
   npm install -g pnpm
   ```

3. **Docker** e **Docker Compose**
   ```bash
   # Verificar instalação
   docker --version
   docker-compose --version
   ```

4. **Git**
   ```bash
   git --version
   ```

### Para Desenvolvimento Mobile (Opcional)

5. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

6. **Android Studio** (para desenvolvimento Android)
7. **Xcode** (para desenvolvimento iOS - apenas macOS)

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/RafaelSR44/FacilitaMaisDefinitivo.git
cd FacilitaMaisDefinitivo
git checkout escalavel
```

### 2. Instale as Dependências

```bash
# Instalar dependências do monorepo
pnpm install

# Instalar dependências específicas de cada app
cd apps/api && npm install && cd ../..
cd apps/web-admin && npm install && cd ../..
cd apps/mobile-client && npm install && cd ../..
cd apps/mobile-provider && npm install && cd ../..
```

### 3. Configure as Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar variáveis conforme necessário
nano .env
```

## 🏃‍♂️ Executando Localmente

### Opção 1: Deploy Completo com Docker (Recomendado)

```bash
# Deploy completo com todos os serviços
./scripts/deploy.sh development

# Aguardar todos os serviços ficarem prontos (2-3 minutos)
# Executar testes de integração
./scripts/integration-tests.sh
```

**Serviços Disponíveis:**
- 🌐 **Dashboard Web:** http://localhost:5173
- 🔌 **API Backend:** http://localhost:3000
- 📈 **Grafana:** http://localhost:3001 (admin/facilita_grafana_2024)
- 📊 **Prometheus:** http://localhost:9090
- 🐰 **RabbitMQ:** http://localhost:15672 (facilita_user/facilita_pass_2024)
- 🔍 **Kibana:** http://localhost:5601

### Opção 2: Execução Individual dos Serviços

#### Backend API

```bash
cd apps/api

# Iniciar PostgreSQL e Redis com Docker
docker-compose up -d postgres redis

# Executar migrações
npm run migration:run

# Iniciar em modo desenvolvimento
npm run start:dev
```

**Disponível em:** http://localhost:3000

#### Dashboard Web Admin

```bash
cd apps/web-admin

# Iniciar servidor de desenvolvimento
npm run dev
```

**Disponível em:** http://localhost:5173

#### App Mobile Cliente

```bash
cd apps/mobile-client

# Iniciar Expo
expo start

# Ou para web
expo start --web
```

#### App Mobile Prestador

```bash
cd apps/mobile-provider

# Iniciar Expo
expo start

# Ou para web
expo start --web
```

## 📱 Aplicações

### 1. Dashboard Web Admin
- **URL:** http://localhost:5173
- **Usuário:** Administradores Porto Seguro
- **Funcionalidades:** KPIs, gráficos, gerenciamento de agendamentos, prestadores e clientes

### 2. App Mobile Cliente
- **Plataforma:** iOS/Android
- **Usuário:** Clientes finais
- **Funcionalidades:** Solicitar serviços, acompanhar prestador, pagamento, avaliações

### 3. App Mobile Prestador
- **Plataforma:** iOS/Android
- **Usuário:** Prestadores de serviço
- **Funcionalidades:** Dashboard de ganhos, gerenciar trabalhos, chat com cliente

### 4. Backend API
- **URL:** http://localhost:3000
- **Documentação:** http://localhost:3000/api (Swagger)
- **GraphQL:** http://localhost:3000/graphql

## 🧪 Testes

### Testes de Integração

```bash
# Executar todos os testes
./scripts/integration-tests.sh

# Executar testes específicos
./scripts/integration-tests.sh health    # Health checks
./scripts/integration-tests.sh api       # Testes de API
./scripts/integration-tests.sh db        # Testes de banco
./scripts/integration-tests.sh security  # Testes de segurança
```

### Testes Unitários

```bash
# Backend
cd apps/api && npm test

# Frontend
cd apps/web-admin && npm test
```

## 🚀 Deploy

### Desenvolvimento

```bash
./scripts/deploy.sh development
```

### Staging

```bash
./scripts/deploy.sh staging
```

### Produção

```bash
./scripts/deploy.sh production
```

## 📚 Documentação

- **[Documentação Técnica](docs/TECHNICAL_DOCUMENTATION.md)** - Arquitetura e detalhes técnicos
- **[Guia do Usuário](docs/USER_GUIDE.md)** - Como usar cada aplicação
- **[API Documentation](http://localhost:3000/api)** - Documentação da API (Swagger)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte técnico, entre em contato através dos canais oficiais da Porto Seguro.

---

**Desenvolvido com ❤️ pela equipe Facilita+ Porto Seguro**
