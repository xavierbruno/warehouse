# 🐳 Docker Setup

Este projeto inclui configuração Docker completa com PostgreSQL, Backend API e Frontend.

## 📋 Pré-requisitos

- Docker instalado ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose instalado (geralmente já vem com Docker Desktop)

## 🏗️ Arquitetura

O projeto é composto por 3 serviços principais:

1. **PostgreSQL** (porta 5433) - Banco de dados relacional
2. **Backend API** (porta 5000) - Node.js/Express REST API
3. **Frontend** (porta 3333) - React app servido por Nginx

## 🚀 Como usar

### Modo Produção (Stack completo)

Para construir e executar toda a aplicação em modo produção:

```bash
# Construir e iniciar todos os containers
docker-compose up -d

# Ou forçar rebuild
docker-compose up --build -d
```

**URLs disponíveis:**

- Frontend: **http://localhost:3333**
- Backend API: **http://localhost:5000/api**
- PostgreSQL: **localhost:5433**

### Modo Desenvolvimento (Hot-reload)

Para desenvolvimento com hot-reload:

```bash
# Iniciar em modo desenvolvimento (frontend apenas)
docker-compose --profile dev up warehouse-dev

# Ou toda a stack com dev frontend
docker-compose --profile dev up -d
```

A aplicação de desenvolvimento estará disponível em: **http://localhost:3001**

## 📦 Comandos úteis

### Parar os containers

```bash
docker-compose down

# Parar e remover volumes (limpa o banco de dados)
docker-compose down -v
```

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviços específicos
docker-compose logs -f postgres
docker-compose logs -f backend
docker-compose logs -f warehouse-app
docker-compose logs -f warehouse-dev
```

### Verificar status dos serviços

```bash
# Ver containers rodando
docker-compose ps

# Health check da API
curl http://localhost:5000/health
```

### Reconstruir a imagem

```bash
docker-compose build --no-cache
```

### Remover containers, volumes e imagens

```bash
docker-compose down -v --rmi all
```

### Acessar os containers

```bash
# Frontend (Produção)
docker exec -it warehouse-schedule-system sh

# Backend
docker exec -it warehouse-backend sh

# PostgreSQL
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

# Frontend (Desenvolvimento)
docker exec -it warehouse-dev sh
```

## 🏗️ Estrutura

### docker-compose.yml

Gerencia 4 serviços:

1. **postgres**: PostgreSQL 15 Alpine

   - Banco de dados principal
   - Volume persistente (`postgres_data`)
   - Health check configurado
   - Script de inicialização automático (`init.sql`)

2. **backend**: Node.js/Express API

   - API REST para gerenciar employees e schedules
   - Conecta automaticamente ao PostgreSQL
   - Aguarda PostgreSQL estar saudável antes de iniciar
   - Ver documentação completa em `API.md`

3. **warehouse-app**: Frontend (Produção)

   - Build otimizado com Vite
   - Servido por Nginx
   - Conecta ao backend via variáveis de ambiente

4. **warehouse-dev**: Frontend (Desenvolvimento)
   - Hot-reload habilitado
   - Volume montado do código local
   - Profile: `dev` (inicia apenas quando solicitado)

### Dockerfiles

- **Frontend** (`./Dockerfile`): Multi-stage build (Node.js + Nginx)
- **Backend** (`./server/Dockerfile`): Node.js Alpine simples

### nginx.conf

- Configuração do Nginx otimizada para SPA (React Router)
- Gzip compression habilitado
- Cache de assets estáticos
- Security headers

### Banco de Dados

- Arquivo `server/database/init.sql` inicializa o schema automaticamente
- Ver `DATABASE.md` para documentação completa do banco

## 🔧 Personalização

### Alterar portas

Edite o arquivo `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - "SUA_PORTA:5432"
  backend:
    ports:
      - "SUA_PORTA:5000"
  warehouse-app:
    ports:
      - "SUA_PORTA:80"
```

### Variáveis de ambiente

#### Backend

Edite as variáveis no `docker-compose.yml` ou crie `server/.env`:

```yaml
environment:
  - DB_HOST=postgres
  - DB_PORT=5432
  - DB_NAME=warehouse_db
  - DB_USER=warehouse_user
  - DB_PASSWORD=SUA_SENHA_SEGURA
```

#### Frontend

```yaml
environment:
  - VITE_API_URL=http://SEU_SERVIDOR:5000/api
```

### Configuração do PostgreSQL

Para alterar credenciais do banco:

1. Edite `docker-compose.yml` (seção `postgres`)
2. Edite `docker-compose.yml` (seção `backend` - deve usar as mesmas credenciais)
3. Remova o volume antigo: `docker volume rm warehouse_postgres_data`
4. Inicie novamente: `docker-compose up -d`

## 📝 Notas

- O container de produção usa Nginx para servir os arquivos estáticos
- O container de desenvolvimento monta o código local como volume para hot-reload
- Os `node_modules` são isolados dentro do container
- A rede `warehouse-network` permite comunicação entre serviços
- PostgreSQL usa volume persistente - dados não são perdidos ao parar containers
- Schema do banco é criado automaticamente na primeira inicialização

## 🐛 Troubleshooting

### Porta já em uso

Se as portas 3333, 5000 ou 5433 já estiverem em uso, altere no `docker-compose.yml`

### Backend não conecta ao PostgreSQL

```bash
# Verificar se postgres está saudável
docker-compose ps

# Ver logs do postgres
docker-compose logs postgres

# Ver logs do backend
docker-compose logs backend

# Reiniciar serviços na ordem correta
docker-compose restart postgres
sleep 5
docker-compose restart backend
```

### Erro "database does not exist"

```bash
# Remover volume e recriar
docker-compose down -v
docker-compose up -d
```

### Permissões no Linux

Se tiver problemas de permissão:

```bash
sudo chown -R $USER:$USER .
```

### Cache de build

Para limpar o cache do Docker:

```bash
docker system prune -a --volumes
```

### Frontend não consegue acessar API

1. Verifique se o backend está rodando: `curl http://localhost:5000/health`
2. Verifique a variável `VITE_API_URL` no container do frontend
3. Em desenvolvimento local (fora do Docker), use `.env.development`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## 📚 Documentação Adicional

- `DATABASE.md` - Documentação completa do banco de dados
- `API.md` - Documentação da API REST
- `README.md` - Visão geral do projeto
