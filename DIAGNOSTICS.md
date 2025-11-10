# 🔍 Guia de Diagnóstico - Logs Detalhados

## 📊 Logs Implementados

O sistema agora possui logs detalhados em todos os pontos críticos:

### 1. **Inicialização do Servidor**

```
============================================================
🚀 Warehouse Schedule System - Backend API
============================================================
📡 Servidor: http://0.0.0.0:5000
📊 Ambiente: production
🗄️  Database: warehouse_db@postgres:5432
🔐 JWT Secret: Configurado
🌐 CORS Origin: *
============================================================
```

### 2. **Conexão com PostgreSQL**

```
============================================================
🗄️  [DATABASE] Configurando conexão PostgreSQL
============================================================
   Host: postgres
   Port: 5432
   Database: warehouse_db
   User: warehouse_user
   Password: ***
   Max connections: 20
============================================================

🔄 [DATABASE] Tentativa de conexão #1...
✅ [DATABASE] Conexão estabelecida com sucesso!
   PostgreSQL Version: PostgreSQL 15.x
   Server Time: 2024-11-10T22:00:00.000Z
📊 [DATABASE] Tabelas encontradas: 4
   - employees
   - payments
   - schedules
   - users
✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)
```

### 3. **Requisições HTTP**

```
────────────────────────────────────────────────────────────────────────────────
📥 [REQUEST] POST /api/auth/login
   Time: 2024-11-10T22:01:55.000Z
   IP: ::ffff:172.18.0.1
   User-Agent: Mozilla/5.0...
   Body: { username: 'admin' }
```

### 4. **Processo de Login**

```
🔐 [LOGIN] Tentativa de login - Username: admin
📊 [LOGIN] Consultando banco de dados...
📊 [LOGIN] Resultado da query: 1 usuário(s) encontrado(s)
✅ [LOGIN] Usuário encontrado - ID: 1, Role: admin
🔑 [LOGIN] Verificando senha...
✅ [LOGIN] Senha válida
📝 [LOGIN] Atualizando last_login...
🎫 [LOGIN] Gerando token JWT...
✅ [LOGIN] Login bem-sucedido - Usuário: admin, Tempo: 45ms
```

### 5. **Erros Detalhados**

```
❌ [LOGIN ERROR] Tempo: 123ms
❌ [LOGIN ERROR] Tipo: Error
❌ [LOGIN ERROR] Mensagem: relation "users" does not exist
❌ [LOGIN ERROR] Código PostgreSQL: 42P01
❌ [LOGIN ERROR] Tabela "users" não existe! Execute a migration.
```

## 🎯 Como Usar os Logs

### No Portainer

```
Containers → warehouse-backend → Logs
```

Ou via terminal:

```bash
docker logs warehouse-backend -f --tail=100
```

### Interpretando os Logs

| Log                          | Significado                          | Ação                               |
| ---------------------------- | ------------------------------------ | ---------------------------------- |
| `⚠️ NÃO DEFINIDA` na senha   | Variável DB_PASSWORD não configurada | Verificar docker-compose.yml       |
| `Tentativa de conexão #5`    | PostgreSQL não responde              | Verificar se postgres está rodando |
| `Tabela 'users' não existe!` | Migration não executada              | Executar migration                 |
| `0 usuário(s)`               | Admin não foi criado                 | Executar seed                      |
| `Código PostgreSQL: 42P01`   | Tabela não existe                    | Executar migration                 |
| `Código PostgreSQL: 28P01`   | Senha do banco errada                | Verificar credenciais              |
| `ECONNREFUSED`               | Postgres não acessível               | Verificar rede Docker              |

## 🔍 Diagnóstico Passo a Passo

### Etapa 1: Verificar Inicialização

**Logs esperados ao iniciar o backend:**

```
🗄️  [DATABASE] Configurando conexão PostgreSQL
🔄 [DATABASE] Tentativa de conexão #1...
✅ [DATABASE] Conexão estabelecida com sucesso!
📊 [DATABASE] Tabelas encontradas: 4
🚀 Warehouse Schedule System - Backend API
```

**Se não aparecer ✅:**

- PostgreSQL não está rodando ou não acessível

### Etapa 2: Verificar Tabelas

**Log esperado:**

```
📊 [DATABASE] Tabelas encontradas: 4
   - employees
   - payments
   - schedules
   - users  ← DEVE APARECER
```

**Se `users` não aparecer:**

- Migration não foi executada
- Execute migration manualmente

### Etapa 3: Verificar Usuários

**Log esperado:**

```
✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)
```

**Se aparecer `0 usuário(s)`:**

- Admin não foi criado
- Execute: `npm run seed`

### Etapa 4: Testar Login

**Logs esperados em um login bem-sucedido:**

```
📥 [REQUEST] POST /api/auth/login
🔐 [LOGIN] Tentativa de login - Username: admin
📊 [LOGIN] Consultando banco de dados...
📊 [LOGIN] Resultado da query: 1 usuário(s) encontrado(s)
✅ [LOGIN] Usuário encontrado - ID: 1, Role: admin
🔑 [LOGIN] Verificando senha...
✅ [LOGIN] Senha válida
✅ [LOGIN] Login bem-sucedido
📤 [RESPONSE] POST /api/auth/login - Status: 200
```

## 🚨 Cenários de Erro Comuns

### Erro 1: Tabela `users` não existe

**Logs:**

```
❌ [LOGIN ERROR] Código PostgreSQL: 42P01
❌ [LOGIN ERROR] Tabela "users" não existe!
```

**Solução:**

```bash
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db << 'EOF'
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF
```

### Erro 2: PostgreSQL não acessível

**Logs:**

```
❌ [DATABASE] Erro na conexão
❌ [DATABASE] Código: ECONNREFUSED
```

**Solução:**

```bash
# Verificar se postgres está rodando
docker ps | grep postgres

# Verificar rede Docker
docker network inspect warehouse_warehouse-network

# Reiniciar postgres
docker-compose restart postgres
```

### Erro 3: Usuário não encontrado

**Logs:**

```
📊 [LOGIN] Resultado da query: 0 usuário(s) encontrado(s)
❌ [LOGIN] Usuário não encontrado: admin
```

**Solução:**

```bash
docker exec -it warehouse-backend npm run seed
```

### Erro 4: Senha inválida

**Logs:**

```
✅ [LOGIN] Usuário encontrado - ID: 1
❌ [LOGIN] Senha inválida para usuário: admin
```

**Solução:**

- Senha está errada
- Recriar admin: `docker exec -it warehouse-backend npm run seed`

## 📋 Comandos de Diagnóstico

### Ver Logs em Tempo Real

```bash
# Backend
docker logs warehouse-backend -f

# PostgreSQL
docker logs warehouse-postgres -f

# Todos
docker-compose logs -f
```

### Verificar Estado dos Containers

```bash
docker-compose ps

# Deve mostrar:
# warehouse-postgres   running (healthy)
# warehouse-backend    running
# warehouse-frontend   running
```

### Testar Conectividade

```bash
# Testar se backend consegue alcançar postgres
docker exec -it warehouse-backend ping postgres

# Testar query simples
docker exec -it warehouse-backend sh -c 'echo "SELECT 1" | psql -h postgres -U warehouse_user -d warehouse_db'
```

### Verificar Tabelas

```bash
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -c "\dt"
```

### Verificar Usuários

```bash
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -c "SELECT id, username, role FROM users;"
```

## 📝 Checklist de Diagnóstico

Copie os logs para análise:

### 1. Logs de Inicialização

```bash
docker logs warehouse-backend --tail=100 > backend_init.log
```

### 2. Logs de Login

```bash
# Tente fazer login, depois:
docker logs warehouse-backend --tail=50 > backend_login.log
```

### 3. Estado do Sistema

```bash
docker-compose ps > containers_status.txt
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -c "\dt" > tables.txt
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -c "SELECT * FROM users;" > users.txt
```

## 🔧 Script de Diagnóstico Completo

Copie e execute no servidor:

```bash
#!/bin/bash
echo "=== Diagnóstico Warehouse System ===" > diagnostics.txt
echo "" >> diagnostics.txt

echo "1. Containers Status:" >> diagnostics.txt
docker-compose ps >> diagnostics.txt 2>&1
echo "" >> diagnostics.txt

echo "2. Backend Logs (últimas 50 linhas):" >> diagnostics.txt
docker logs warehouse-backend --tail=50 >> diagnostics.txt 2>&1
echo "" >> diagnostics.txt

echo "3. PostgreSQL Logs (últimas 30 linhas):" >> diagnostics.txt
docker logs warehouse-postgres --tail=30 >> diagnostics.txt 2>&1
echo "" >> diagnostics.txt

echo "4. Tabelas do Banco:" >> diagnostics.txt
docker exec warehouse-postgres psql -U warehouse_user -d warehouse_db -c "\dt" >> diagnostics.txt 2>&1
echo "" >> diagnostics.txt

echo "5. Usuários:" >> diagnostics.txt
docker exec warehouse-postgres psql -U warehouse_user -d warehouse_db -c "SELECT id, username, role, is_active FROM users;" >> diagnostics.txt 2>&1
echo "" >> diagnostics.txt

echo "6. Health Check:" >> diagnostics.txt
curl -s http://localhost:5000/health >> diagnostics.txt 2>&1
echo "" >> diagnostics.txt

cat diagnostics.txt
```

## 🎯 O Que Fazer Agora

1. **No Portainer**:

   - Containers → warehouse-backend → Logs
   - **Copie as primeiras 100 linhas** e me envie

2. **Procure por:**

   - ✅ ou ❌ na conexão com PostgreSQL
   - Lista de tabelas encontradas
   - Mensagens de erro com código PostgreSQL
   - Stack trace de erros

3. **Me envie aqui** para eu analisar e dar a solução exata!

Com esses logs detalhados, vamos identificar o problema rapidamente! 🎯
