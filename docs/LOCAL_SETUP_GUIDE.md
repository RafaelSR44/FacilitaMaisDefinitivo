# 🛠️ Guia Completo de Instalação e Execução Local

Este guia detalha **passo a passo** como instalar todas as dependências e executar a plataforma Facilita+ Porto Seguro Edition localmente.

## 📋 Pré-requisitos do Sistema

### 1. Sistema Operacional

**Compatível com:**
- Windows 10/11 (com WSL2 recomendado)
- macOS 10.15+
- Linux (Ubuntu 20.04+, CentOS 8+, etc.)

### 2. Instalação do Node.js

#### Windows
1. Acesse [nodejs.org](https://nodejs.org/)
2. Baixe a versão LTS (18.x ou superior)
3. Execute o instalador e siga as instruções
4. Verifique a instalação:
   ```cmd
   node --version
   npm --version
   ```

#### macOS
```bash
# Usando Homebrew (recomendado)
brew install node

# Ou baixar do site oficial
# https://nodejs.org/
```

#### Linux (Ubuntu/Debian)
```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 3. Instalação do pnpm

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar instalação
pnpm --version
```

### 4. Instalação do Docker

#### Windows
1. Baixe [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Execute o instalador
3. Reinicie o computador
4. Abra Docker Desktop e aguarde inicialização
5. Verifique:
   ```cmd
   docker --version
   docker-compose --version
   ```

#### macOS
```bash
# Usando Homebrew
brew install --cask docker

# Ou baixar Docker Desktop do site oficial
```

#### Linux (Ubuntu)
```bash
# Remover versões antigas
sudo apt-get remove docker docker-engine docker.io containerd runc

# Instalar dependências
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Adicionar chave GPG oficial do Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Configurar repositório
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar sessão ou executar:
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

### 5. Instalação do Git

#### Windows
1. Baixe [Git for Windows](https://git-scm.com/download/win)
2. Execute o instalador com configurações padrão

#### macOS
```bash
# Git já vem instalado, mas pode atualizar via Homebrew
brew install git
```

#### Linux
```bash
sudo apt-get install git
```

### 6. Ferramentas para Desenvolvimento Mobile (Opcional)

#### Expo CLI
```bash
npm install -g @expo/cli
```

#### Android Studio (para Android)
1. Baixe [Android Studio](https://developer.android.com/studio)
2. Instale seguindo as instruções
3. Configure Android SDK
4. Configure variáveis de ambiente:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### Xcode (para iOS - apenas macOS)
1. Instale via App Store
2. Abra Xcode e aceite os termos
3. Instale simuladores iOS

## 🚀 Instalação do Projeto

### 1. Clone o Repositório

```bash
# Clone o repositório
git clone https://github.com/RafaelSR44/FacilitaMaisDefinitivo.git

# Entre no diretório
cd FacilitaMaisDefinitivo

# Mude para a branch escalavel
git checkout escalavel
```

### 2. Instale as Dependências

```bash
# Instalar dependências do monorepo (raiz)
pnpm install

# Instalar dependências do Backend API
cd apps/api
npm install
cd ../..

# Instalar dependências do Frontend Web
cd apps/web-admin
npm install
cd ../..

# Instalar dependências do App Cliente
cd apps/mobile-client
npm install
cd ../..

# Instalar dependências do App Prestador
cd apps/mobile-provider
npm install
cd ../..
```

### 3. Configure Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env
nano .env  # ou use seu editor preferido
```

**Exemplo de .env:**
```env
# Database
DATABASE_URL=postgresql://facilita_user:facilita_pass_2024@localhost:5432/facilita_porto

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=facilita_jwt_secret_2024_porto_seguro
JWT_REFRESH_SECRET=facilita_refresh_secret_2024_porto

# APIs Externas (opcional para desenvolvimento)
GOOGLE_MAPS_API_KEY=your_google_maps_key
SENDGRID_API_KEY=your_sendgrid_key
```

## 🏃‍♂️ Executando a Aplicação

### Opção 1: Deploy Completo com Docker (Mais Fácil)

```bash
# Tornar scripts executáveis (Linux/macOS)
chmod +x scripts/deploy.sh
chmod +x scripts/integration-tests.sh

# Executar deploy completo
./scripts/deploy.sh development
```

**Aguarde 2-3 minutos** para todos os serviços iniciarem.

#### Verificar se está funcionando:

```bash
# Executar testes de integração
./scripts/integration-tests.sh
```

#### Acessar as aplicações:

- **🌐 Dashboard Web:** http://localhost:5173
- **🔌 API Backend:** http://localhost:3000
- **📊 Documentação API:** http://localhost:3000/api
- **📈 Grafana:** http://localhost:3001 (admin/facilita_grafana_2024)
- **📊 Prometheus:** http://localhost:9090
- **🐰 RabbitMQ:** http://localhost:15672 (facilita_user/facilita_pass_2024)
- **🔍 Kibana:** http://localhost:5601

### Opção 2: Execução Manual (Para Desenvolvimento)

#### 1. Iniciar Banco de Dados e Cache

```bash
# Iniciar PostgreSQL e Redis
docker-compose up -d postgres redis

# Aguardar serviços ficarem prontos
sleep 30
```

#### 2. Executar Backend API

```bash
# Navegar para o backend
cd apps/api

# Executar migrações do banco
npm run migration:run

# Inserir dados de exemplo (opcional)
npm run seed:run

# Iniciar servidor de desenvolvimento
npm run start:dev
```

**Backend disponível em:** http://localhost:3000

#### 3. Executar Frontend Web (Nova aba do terminal)

```bash
# Navegar para o frontend
cd apps/web-admin

# Iniciar servidor de desenvolvimento
npm run dev
```

**Frontend disponível em:** http://localhost:5173

#### 4. Executar App Mobile Cliente (Nova aba do terminal)

```bash
# Navegar para o app cliente
cd apps/mobile-client

# Iniciar Expo
expo start

# Opções:
# - Pressione 'w' para abrir no navegador
# - Escaneie QR code com Expo Go (iOS/Android)
# - Pressione 'i' para iOS Simulator (macOS)
# - Pressione 'a' para Android Emulator
```

#### 5. Executar App Mobile Prestador (Nova aba do terminal)

```bash
# Navegar para o app prestador
cd apps/mobile-provider

# Iniciar Expo
expo start
```

## 🧪 Testando a Aplicação

### 1. Testes Automatizados

```bash
# Testes de integração completos
./scripts/integration-tests.sh

# Testes específicos
./scripts/integration-tests.sh health    # Health checks
./scripts/integration-tests.sh api       # Testes de API
./scripts/integration-tests.sh db        # Testes de banco
```

### 2. Testes Manuais

#### Backend API
1. Acesse http://localhost:3000/health
2. Deve retornar: `{"status":"ok"}`

#### Frontend Web
1. Acesse http://localhost:5173
2. Deve carregar o dashboard com gráficos

#### Apps Mobile
1. Abra o Expo no celular
2. Escaneie o QR code
3. App deve carregar a tela de login

## 🔧 Solução de Problemas

### Problema: "Docker não encontrado"

**Solução:**
```bash
# Verificar se Docker está rodando
docker ps

# Se não estiver, iniciar Docker Desktop (Windows/macOS)
# Ou iniciar serviço (Linux):
sudo systemctl start docker
```

### Problema: "Porta já em uso"

**Solução:**
```bash
# Verificar processos usando a porta
lsof -i :3000  # ou :5173, :5432, etc.

# Matar processo
kill -9 <PID>

# Ou usar portas diferentes no .env
```

### Problema: "Erro de permissão no script"

**Solução:**
```bash
# Dar permissão de execução (Linux/macOS)
chmod +x scripts/deploy.sh
chmod +x scripts/integration-tests.sh
```

### Problema: "Dependências não instaladas"

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm package-lock.json
npm install

# Ou usar pnpm
pnpm install --frozen-lockfile
```

### Problema: "Banco de dados não conecta"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Verificar logs
docker logs facilita-postgres

# Recriar container
docker-compose down
docker-compose up -d postgres
```

## 📱 Desenvolvimento Mobile

### Testando no Dispositivo Físico

1. **Instale o Expo Go:**
   - iOS: App Store
   - Android: Google Play Store

2. **Execute o projeto:**
   ```bash
   cd apps/mobile-client
   expo start
   ```

3. **Conecte o dispositivo:**
   - Escaneie o QR code com Expo Go
   - Ou use a câmera (iOS) / Expo Go (Android)

### Testando no Emulador

#### Android Emulator
1. Abra Android Studio
2. Vá em Tools > AVD Manager
3. Crie/inicie um emulador
4. No terminal do Expo, pressione 'a'

#### iOS Simulator (macOS apenas)
1. Instale Xcode
2. No terminal do Expo, pressione 'i'

## 🚀 Deploy em Produção

### Preparação

1. **Configure variáveis de produção:**
   ```bash
   cp .env.example .env.production
   # Edite com valores reais de produção
   ```

2. **Execute deploy:**
   ```bash
   ./scripts/deploy.sh production
   ```

### Monitoramento

Após o deploy, monitore:
- **Grafana:** Métricas de performance
- **Kibana:** Logs da aplicação
- **Prometheus:** Alertas do sistema

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs:**
   ```bash
   docker-compose logs -f [service_name]
   ```

2. **Execute diagnósticos:**
   ```bash
   ./scripts/integration-tests.sh health
   ```

3. **Documente o erro** e entre em contato com a equipe de desenvolvimento.

---

**🎉 Parabéns! Sua instalação está completa!**

A plataforma Facilita+ Porto Seguro Edition está pronta para uso em seu ambiente local.
