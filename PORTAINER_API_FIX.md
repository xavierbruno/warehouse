# 🔧 Fix: Frontend Não Conecta ao Backend (ERR_CONNECTION_REFUSED)

## 🚨 Problema

```
localhost:5000/api/auth/login:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

O frontend está tentando conectar em `localhost:5000`, mas deveria usar o IP do servidor `213.199.59.34:5000`.

## 🎯 Causa

O frontend foi buildado com a URL da API hardcoded como `localhost`. Isso acontece porque a variável `VITE_API_URL` não foi configurada durante o build.

## ✅ Soluções

### Solução 1: Configurar Variável de Ambiente no Portainer (RECOMENDADO)

**No Portainer:**

1. **Acessar Stack**

   - Stacks → warehouse-schedule-system → Editor

2. **Adicionar Variável de Ambiente**

   - Na seção "Environment variables", adicione:

   ```
   VITE_API_URL=http://213.199.59.34:5000/api
   ```

3. **Rebuild**

   - Marque: "Re-pull image and redeploy"
   - Clique: "Update the stack"

4. **Aguardar Build**
   - O build pode demorar 2-5 minutos
   - Acompanhe em: Container → Logs

### Solução 2: Editar docker-compose.yml no Portainer

**No Editor do Stack:**

Encontre a seção `warehouse-app` e adicione:

```yaml
warehouse-app:
  build:
    context: .
    dockerfile: Dockerfile
    args:
      VITE_API_URL: http://213.199.59.34:5000/api # ← ADICIONAR
  container_name: warehouse-schedule-system
  ports:
    - "3333:80"
```

Clique em "Update the stack" e aguarde o rebuild.

### Solução 3: Usar Proxy Reverso (MELHOR PARA PRODUÇÃO)

Configure Nginx para fazer proxy da API:

**Adicione ao `nginx.conf`:**

```nginx
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy para Backend
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**E configure o frontend para usar URL relativa:**

```
VITE_API_URL=/api
```

**Vantagens:**

- ✅ Não precisa expor porta 5000
- ✅ Mesma origem (sem problemas de CORS)
- ✅ Mais seguro

## 🚀 Solução Rápida para Seu Caso

### Opção A: No Portainer (Recomendado)

**Stack → Editor → Environment variables:**

```
VITE_API_URL=http://213.199.59.34:5000/api
```

**Stack → Editor → Web editor:**

Altere esta seção:

```yaml
warehouse-app:
  build:
    context: .
    dockerfile: Dockerfile
    args:
      VITE_API_URL: http://213.199.59.34:5000/api
```

Depois: **"Update the stack"** e aguarde rebuild.

### Opção B: Se Tiver Domínio

Se você tiver um domínio (ex: `warehouse.seudominio.com`):

```
VITE_API_URL=https://warehouse.seudominio.com/api
```

## 📝 Verificar se Funcionou

### 1. Limpar Cache do Navegador

```
Ctrl + Shift + Delete → Limpar cache
```

Ou abra em modo anônimo.

### 2. Verificar no Console (F12)

Após rebuild, abra o console e verifique:

```javascript
// Deve mostrar o IP correto, não localhost
console.log("API URL:", import.meta.env.VITE_API_URL);
```

### 3. Verificar Network Tab

No DevTools (F12) → Network:

- Deve mostrar requests para `http://213.199.59.34:5000/api/...`
- Não deve mais aparecer `localhost:5000`

### 4. Testar Login

- Tente fazer login com `admin` / `admin123`
- Verifique no Network se a requisição foi para o IP correto

## 🔒 Segurança e CORS

### Backend CORS

Se ainda der erro de CORS, configure no backend:

**No docker-compose.yml:**

```yaml
backend:
  environment:
    - CORS_ORIGIN=http://213.199.59.34:3333
```

**Ou para aceitar qualquer origem (desenvolvimento):**

```yaml
backend:
  environment:
    - CORS_ORIGIN=*
```

⚠️ Em produção, sempre especifique a origem exata!

## 🌐 Configuração Completa para Produção

### docker-compose.yml Completo:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: warehouse-postgres
    environment:
      POSTGRES_DB: warehouse_db
      POSTGRES_USER: warehouse_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-warehouse_pass_2024}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - warehouse-network
    restart: unless-stopped
    # Não expor porta em produção!

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
      DB_PASSWORD: ${DB_PASSWORD:-warehouse_pass_2024}
      JWT_SECRET: ${JWT_SECRET:-change-in-production}
      CORS_ORIGIN: ${CORS_ORIGIN:-http://213.199.59.34:3333}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    networks:
      - warehouse-network
    restart: unless-stopped

  frontend:
    build:
      context: .
      args:
        VITE_API_URL: ${VITE_API_URL:-http://213.199.59.34:5000/api}
    container_name: warehouse-frontend
    ports:
      - "3333:80"
    depends_on:
      - backend
    networks:
      - warehouse-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  warehouse-network:
    driver: bridge
```

### Environment Variables no Portainer:

```
VITE_API_URL=http://213.199.59.34:5000/api
CORS_ORIGIN=http://213.199.59.34:3333
JWT_SECRET=sua-chave-secreta-forte-aqui
DB_PASSWORD=senha-do-banco-segura
```

## 🔄 Processo Completo de Deploy

```bash
1. Configurar variáveis de ambiente no Portainer
2. Update the stack (com rebuild)
3. Aguardar build completar (2-5 min)
4. Verificar logs: Container → backend → Logs
5. Verificar logs: Container → frontend → Logs
6. Limpar cache do navegador
7. Acessar: http://213.199.59.34:3333
8. Testar login: admin / admin123
```

## 🐛 Troubleshooting

### Erro persiste após rebuild

**Solução:**

1. **Remover stack completamente:**

   ```
   Portainer → Stacks → warehouse → Remove
   ```

2. **Criar nova stack:**

   ```
   Add stack → Configurar variáveis → Deploy
   ```

3. **Forçar rebuild sem cache:**
   ```bash
   # Via SSH no servidor
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Backend não está acessível

**Verificar:**

```bash
# Testar do servidor
curl http://localhost:5000/health

# Testar externamente
curl http://213.199.59.34:5000/health
```

**Se falhar:**

- Verificar firewall
- Verificar se backend está rodando: `docker ps`
- Ver logs: `docker logs warehouse-backend`

### CORS Error

```
Access to fetch at 'http://213.199.59.34:5000/api/auth/login'
from origin 'http://213.199.59.34:3333' has been blocked by CORS policy
```

**Solução:**

Configure `CORS_ORIGIN` no backend:

```yaml
backend:
  environment:
    - CORS_ORIGIN=http://213.199.59.34:3333
```

## ✅ Checklist Final

- [ ] `VITE_API_URL` configurado no Portainer
- [ ] Stack atualizado com rebuild
- [ ] Build completado sem erros
- [ ] Backend acessível: `curl http://213.199.59.34:5000/health`
- [ ] Frontend carregado: `http://213.199.59.34:3333`
- [ ] Cache do navegador limpo
- [ ] Login testado e funcionando
- [ ] Network tab mostra requests para IP correto
- [ ] CORS configurado corretamente

## 📞 Ainda com Problemas?

Forneça:

1. Saída de: `docker ps`
2. Logs: `docker logs warehouse-backend`
3. Logs: `docker logs warehouse-frontend`
4. Screenshot do Network tab (F12)
5. Variáveis de ambiente configuradas no Portainer
