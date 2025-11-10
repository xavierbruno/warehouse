# 🐳 Docker Setup

Este projeto inclui configuração Docker para facilitar o desenvolvimento e deploy.

## 📋 Pré-requisitos

- Docker instalado ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose instalado (geralmente já vem com Docker Desktop)

## 🚀 Como usar

### Modo Produção (Build otimizado com Nginx)

Para construir e executar a aplicação em modo produção:

```bash
# Construir e iniciar o container
docker-compose up -d

# Ou forçar rebuild
docker-compose up --build -d
```

A aplicação estará disponível em: **http://localhost:3000**

### Modo Desenvolvimento (Hot-reload)

Para desenvolvimento com hot-reload:

```bash
# Iniciar em modo desenvolvimento
docker-compose --profile dev up warehouse-dev
```

A aplicação de desenvolvimento estará disponível em: **http://localhost:3001**

## 📦 Comandos úteis

### Parar os containers

```bash
docker-compose down
```

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas produção
docker-compose logs -f warehouse-app

# Apenas desenvolvimento
docker-compose logs -f warehouse-dev
```

### Reconstruir a imagem

```bash
docker-compose build --no-cache
```

### Remover containers, volumes e imagens

```bash
docker-compose down -v --rmi all
```

### Acessar o container

```bash
# Produção
docker exec -it warehouse-schedule-system sh

# Desenvolvimento
docker exec -it warehouse-dev sh
```

## 🏗️ Estrutura

### Dockerfile (Multi-stage)

- **Stage 1 (builder)**: Instala dependências e faz o build da aplicação
- **Stage 2 (production)**: Usa Nginx Alpine para servir os arquivos estáticos

### docker-compose.yml

- **warehouse-app**: Container de produção (porta 3000)
- **warehouse-dev**: Container de desenvolvimento com hot-reload (porta 3001, profile `dev`)

### nginx.conf

- Configuração do Nginx otimizada para SPA (React Router)
- Gzip compression habilitado
- Cache de assets estáticos
- Security headers

## 🔧 Personalização

### Alterar portas

Edite o arquivo `docker-compose.yml`:

```yaml
ports:
  - "SUA_PORTA:80" # para produção
  - "SUA_PORTA:3000" # para desenvolvimento
```

### Variáveis de ambiente

Adicione variáveis no `docker-compose.yml`:

```yaml
environment:
  - REACT_APP_API_URL=https://sua-api.com
  - NODE_ENV=production
```

## 📝 Notas

- O container de produção usa Nginx para servir os arquivos estáticos
- O container de desenvolvimento monta o código local como volume para hot-reload
- Os `node_modules` são isolados dentro do container
- A rede `warehouse-network` permite comunicação entre serviços

## 🐛 Troubleshooting

### Porta já em uso

Se a porta 3000 ou 3001 já estiver em uso, altere no `docker-compose.yml`

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
