# 🔒 Guia de Produção e Segurança

Checklist e guia para deploy em produção do Warehouse Schedule System.

## ⚠️ Checklist de Segurança

### 🔐 Credenciais do Banco de Dados

**❌ NUNCA use as credenciais padrão em produção!**

Altere no `docker-compose.yml`:

```yaml
services:
  postgres:
    environment:
      POSTGRES_DB: warehouse_prod_db
      POSTGRES_USER: warehouse_prod_user
      POSTGRES_PASSWORD: ${DB_PASSWORD} # Use variável de ambiente

  backend:
    environment:
      DB_PASSWORD: ${DB_PASSWORD}
```

Crie um arquivo `.env` na raiz (NÃO commite no git):

```bash
DB_PASSWORD=SuaSenhaForteAqui123!@#
```

### 🔑 Variáveis de Ambiente

Crie `.env.production` para o backend:

```bash
NODE_ENV=production
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=warehouse_prod_db
DB_USER=warehouse_prod_user
DB_PASSWORD=SuaSenhaSegura123!
CORS_ORIGIN=https://seu-dominio.com
```

### 🌐 CORS

Configure CORS adequadamente no backend (`server/server.js`):

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://seu-dominio.com",
    credentials: true,
  })
);
```

### 🛡️ HTTPS/SSL

Em produção, use HTTPS:

```nginx
# nginx.conf para produção com SSL
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # ... resto da configuração
}

server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

## 📦 Otimizações de Produção

### 1. Variáveis de Ambiente

Atualizar `docker-compose.yml` para produção:

```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
      - DB_PASSWORD=${DB_PASSWORD}
    restart: always
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M

  postgres:
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups # Para backups automáticos
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 1G
```

### 2. Nginx - Configuração de Produção

```nginx
# nginx.conf otimizado
server {
    listen 80;
    server_name _;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;

    # Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. PostgreSQL - Otimizações

Adicione ao `docker-compose.yml`:

```yaml
services:
  postgres:
    command: >
      postgres
      -c shared_buffers=256MB
      -c max_connections=200
      -c effective_cache_size=1GB
      -c maintenance_work_mem=64MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
```

## 🔄 Backup Automático

### Script de Backup

Crie `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/warehouse_backup_$TIMESTAMP.sql"

docker exec warehouse-postgres pg_dump -U warehouse_user warehouse_db > "$BACKUP_FILE"

# Comprimir
gzip "$BACKUP_FILE"

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup criado: $BACKUP_FILE.gz"
```

### Cron Job (Linux)

```bash
# Backup diário às 2h da manhã
crontab -e

# Adicionar:
0 2 * * * /path/to/backup.sh >> /var/log/warehouse_backup.log 2>&1
```

### Windows Task Scheduler

Crie um arquivo `backup.ps1`:

```powershell
$BackupDir = "C:\backups\warehouse"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\warehouse_backup_$Timestamp.sql"

docker exec warehouse-postgres pg_dump -U warehouse_user warehouse_db | Out-File $BackupFile

# Comprimir
Compress-Archive -Path $BackupFile -DestinationPath "$BackupFile.zip"
Remove-Item $BackupFile

# Limpar backups antigos (>7 dias)
Get-ChildItem $BackupDir -Filter "*.zip" | Where-Object {$_.CreationTime -lt (Get-Date).AddDays(-7)} | Remove-Item
```

## 📊 Monitoramento

### Health Checks

Configure monitoramento externo para:

```bash
# API Health
curl https://seu-dominio.com/health

# Expected: {"status":"ok","database":"connected"}
```

### Logs

```bash
# Configurar log rotation
docker-compose.yml:

services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Métricas

Considere adicionar:

- Prometheus + Grafana para métricas
- Sentry para tracking de erros
- NewRelic ou Datadog para APM

## 🔥 Firewall

### Portas a expor

```bash
# Frontend
3333 (ou 80/443 com proxy reverso)

# Backend API
5000 (ou usar proxy reverso interno)

# PostgreSQL
NUNCA expor 5433 publicamente!
```

### Configuração básica (Linux UFW)

```bash
# Permitir HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Bloquear PostgreSQL de acesso externo
sudo ufw deny 5433/tcp

# Permitir SSH (se necessário)
sudo ufw allow 22/tcp

# Ativar firewall
sudo ufw enable
```

## 🚀 Deploy

### Docker Compose em Produção

```bash
# 1. Clone o repositório
git clone <repo>
cd warehouse

# 2. Configure variáveis de ambiente
cp .env.example .env
nano .env  # Edite com credenciais seguras

# 3. Build e start
docker-compose -f docker-compose.yml up -d --build

# 4. Verificar
docker-compose ps
curl http://localhost:5000/health
```

### Atualização (Deploy de nova versão)

```bash
# 1. Pull do código
git pull origin main

# 2. Rebuild
docker-compose build

# 3. Restart com zero downtime
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build warehouse-app

# 4. Verificar
docker-compose ps
curl http://localhost:5000/health
```

## 🧪 Testes antes do Deploy

```bash
# 1. Testar build local
docker-compose build

# 2. Testar em ambiente de staging
docker-compose -f docker-compose.staging.yml up -d

# 3. Smoke tests
curl http://staging-url/health
curl http://staging-url/api/employees

# 4. Load testing (opcional)
# Use ferramentas como Apache Bench, k6, ou Artillery
```

## 📋 Checklist Final

Antes de colocar em produção:

- [ ] Credenciais do banco alteradas
- [ ] CORS configurado corretamente
- [ ] HTTPS/SSL configurado
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Logs configurados com rotation
- [ ] Health checks configurados
- [ ] Monitoramento ativo
- [ ] Variáveis de ambiente em arquivo `.env` seguro
- [ ] `.env` adicionado ao `.gitignore`
- [ ] Testes funcionais realizados
- [ ] Documentação atualizada
- [ ] Equipe treinada

## 🆘 Plano de Disaster Recovery

### Backup

1. **Diário**: Backup automático do PostgreSQL
2. **Semanal**: Backup completo (código + banco + configurações)
3. **Mensal**: Backup offsite (cloud storage)

### Restauração

```bash
# 1. Parar serviços
docker-compose down

# 2. Restaurar banco
cat backup.sql | docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db

# 3. Reiniciar
docker-compose up -d

# 4. Verificar
curl http://localhost:5000/health
```

## 📞 Suporte

Para questões de produção:

- **Logs**: `docker-compose logs -f`
- **Status**: `docker-compose ps`
- **Metrics**: Ver dashboard de monitoramento
- **Database**: `DATABASE.md`
- **API**: `API.md`

---

**Lembre-se**: Segurança é um processo contínuo, não uma tarefa única! 🔒
