# 🐳 Deploy no Portainer.io

Guia completo para fazer deploy do Warehouse Schedule System no Portainer.

## 📋 Pré-requisitos

- Portainer.io configurado e rodando
- Acesso ao repositório Git ou arquivos locais
- Permissões para criar stacks no Portainer

## 🚀 Deploy via Portainer

### Método 1: Via Git Repository (Recomendado)

1. **Acessar Portainer**

   - Abra Portainer.io
   - Selecione seu environment

2. **Criar Nova Stack**

   - Menu lateral → **Stacks**
   - Botão **Add stack**

3. **Configurar Stack**

   - **Name**: `warehouse-schedule-system`
   - **Build method**: Git Repository
   - **Repository URL**: `<seu-repositorio-git>`
   - **Repository reference**: `refs/heads/main` (ou sua branch)
   - **Compose path**: `docker-compose.yml`

4. **Variáveis de Ambiente**

   Adicione estas variáveis em **Environment variables**:

   ```
   JWT_SECRET=sua-chave-secreta-muito-forte-aqui-123
   DB_PASSWORD=warehouse_pass_2024
   ```

5. **Deploy**
   - Clique em **Deploy the stack**
   - Aguarde o build completar

### Método 2: Via Web Editor

1. **Acessar Portainer**

   - Stacks → Add stack

2. **Configurar Stack**

   - **Name**: `warehouse-schedule-system`
   - **Build method**: Web editor

3. **Copiar docker-compose.yml**

   Cole o conteúdo do `docker-compose.yml` no editor

4. **Variáveis de Ambiente**

   No campo **Environment variables**, adicione:

   ```
   JWT_SECRET=sua-chave-secreta-forte
   ```

5. **Deploy**
   - Clique em **Deploy the stack**

### Método 3: Via Upload

1. **Preparar Arquivos**

   Crie um arquivo zip com:

   ```
   warehouse/
   ├── docker-compose.yml
   ├── Dockerfile
   ├── nginx.conf
   ├── package.json
   ├── src/
   └── server/
   ```

2. **Upload no Portainer**

   - Stacks → Add stack
   - Build method: Upload
   - Selecione o arquivo zip

3. **Deploy**

## ⚙️ Configuração Específica para Portainer

### docker-compose.yml para Portainer

Se estiver tendo problemas, use esta versão simplificada:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: warehouse-postgres
    environment:
      POSTGRES_DB: warehouse_db
      POSTGRES_USER: warehouse_user
      POSTGRES_PASSWORD: warehouse_pass_2024
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U warehouse_user -d warehouse_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./server
    container_name: warehouse-backend
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: warehouse_db
      DB_USER: warehouse_user
      DB_PASSWORD: warehouse_pass_2024
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build:
      context: .
      args:
        VITE_API_URL: http://localhost:5000/api
    container_name: warehouse-frontend
    ports:
      - "3333:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

## 🔧 Troubleshooting

### Erro: "npm ci failed"

**Solução**: O Dockerfile do backend foi atualizado para usar `npm install` ao invés de `npm ci`

Verifique se `server/Dockerfile` contém:

```dockerfile
# Instalar dependências
RUN npm install --production
```

### Erro: "Build context error"

**Problema**: Portainer não consegue acessar o contexto de build

**Soluções**:

1. **Via Git**: Certifique-se que o repositório é público ou configure credenciais
2. **Via Upload**: Inclua todos os arquivos necessários no zip
3. **Via Web Editor**: Use imagens pré-buildadas

### Erro: "Health check failed"

**Problema**: PostgreSQL não está pronto quando backend tenta conectar

**Solução**:

Adicione ao `docker-compose.yml`:

```yaml
backend:
  depends_on:
    postgres:
      condition: service_healthy
```

### Erro: "Port already in use"

**Problema**: Portas 3333, 5000 ou 5432 já estão em uso

**Solução**:

Altere as portas no `docker-compose.yml`:

```yaml
ports:
  - "8080:80" # Frontend
  - "8081:5000" # Backend
  - "5433:5432" # Postgres
```

### Build lento ou timeout

**Problema**: Build demorando muito

**Soluções**:

1. **Use imagens pré-buildadas** (recomendado):

```yaml
backend:
  image: seu-usuario/warehouse-backend:latest
  # Ao invés de build
```

2. **Aumente timeout no Portainer**:

   - Settings → Preferences → Timeout

3. **Build local e push para registry**:

```bash
# Build local
docker build -t warehouse-backend:latest ./server
docker build -t warehouse-frontend:latest .

# Push para registry
docker tag warehouse-backend:latest seu-usuario/warehouse-backend:latest
docker push seu-usuario/warehouse-backend:latest
```

## 📊 Verificação Pós-Deploy

### 1. Verificar Containers

No Portainer:

- Stacks → warehouse-schedule-system
- Verificar se todos os 3 containers estão **running**

### 2. Verificar Logs

```
Containers → warehouse-backend → Logs
```

Procure por:

```
✅ Conectado ao PostgreSQL
🚀 Servidor rodando na porta 5000
```

### 3. Testar API

Via Console do Portainer ou terminal:

```bash
curl http://localhost:5000/health
```

Deve retornar:

```json
{ "status": "ok", "database": "connected" }
```

### 4. Criar Usuário Admin

Execute no container backend:

```bash
# Via Portainer Console ou terminal
npm run seed
```

### 5. Executar Migration

No container postgres:

```bash
psql -U warehouse_user -d warehouse_db -f /docker-entrypoint-initdb.d/auth_migration.sql
```

Ou via Portainer:

- Containers → warehouse-postgres → Console
- Executar:

```bash
psql -U warehouse_user -d warehouse_db
\i /docker-entrypoint-initdb.d/auth_migration.sql
```

### 6. Acessar Frontend

Abra: `http://seu-servidor:3333`

Login: `admin` / `admin123`

## 🔐 Segurança para Produção

### 1. Alterar Credenciais

Antes de ir para produção, altere:

```yaml
environment:
  POSTGRES_PASSWORD: ${DB_PASSWORD} # Via env vars
  JWT_SECRET: ${JWT_SECRET} # Via env vars
```

Configure no Portainer:

- Stack → Editor → Environment variables

### 2. Usar Secrets (Opcional)

```yaml
secrets:
  db_password:
    external: true
  jwt_secret:
    external: true

services:
  postgres:
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
```

### 3. Configurar HTTPS

Use um proxy reverso (Traefik, Nginx Proxy Manager):

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.warehouse.rule=Host(`warehouse.seudominio.com`)"
  - "traefik.http.routers.warehouse.tls.certresolver=letsencrypt"
```

## 🔄 Update/Redeploy

### Atualizar Stack

1. **Pull mudanças** (se via Git):

   - Stack → warehouse-schedule-system
   - **Pull and redeploy**

2. **Rebuild** (se houve mudanças no código):

   - Marque opção **Re-pull image and redeploy**

3. **Com downtime**:

   - Stop → Remove → Deploy novamente

4. **Sem downtime**:
   - Use blue-green deployment ou rolling updates

### Atualizar apenas um serviço

```bash
# Via Portainer Console ou SSH
docker-compose up -d --no-deps --build backend
```

## 📝 Checklist de Deploy

- [ ] Docker Compose configurado
- [ ] Variáveis de ambiente definidas
- [ ] Stack criada no Portainer
- [ ] Build concluído sem erros
- [ ] Todos os containers running
- [ ] PostgreSQL health check OK
- [ ] Backend conectado ao banco
- [ ] Migration executada
- [ ] Usuário admin criado
- [ ] Frontend acessível
- [ ] Login funcionando
- [ ] Credenciais alteradas (produção)
- [ ] Backup configurado
- [ ] Monitoramento ativo

## 📞 Suporte

Para problemas específicos:

- Logs do Portainer: Container → Logs
- Logs do Docker: `docker-compose logs -f`
- Health: `curl http://localhost:5000/health`

Documentação relacionada:

- `DOCKER.md` - Docker completo
- `AUTH_SETUP.md` - Setup de autenticação
- `PRODUCTION.md` - Segurança em produção
