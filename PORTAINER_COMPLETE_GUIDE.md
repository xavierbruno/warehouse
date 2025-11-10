# 🚀 Guia Completo - Deploy no Portainer com Logs

## ⚡ Setup Rápido (Copie e Cole)

### 1. Deploy da Stack no Portainer

**Environment Variables:**

```
VITE_API_URL=http://213.199.59.34:5000/api
JWT_SECRET=sua-chave-secreta-forte-123
```

### 2. Aguardar Build Completar

Acompanhe em: **Containers → warehouse-backend → Logs**

### 3. Executar Setup Automático

No Portainer, acesse o **Console** do backend:

```
Containers → warehouse-backend → Console
```

Execute:

```bash
npm run setup
```

**Output esperado:**

```
============================================================
🚀 Warehouse System - Setup Automático
============================================================

1️⃣  Verificando conexão com PostgreSQL...
   ✅ Conexão OK

2️⃣  Verificando tabela 'users'...
   ⚠️  Tabela 'users' não existe. Criando...
   ✅ Tabela 'users' criada

3️⃣  Verificando usuário admin...
   ⚠️  Usuário admin não existe. Criando...
   ✅ Usuário admin criado:
      Username: admin
      Password: admin123
      Email: admin@warehouse.com

4️⃣  Verificando outras tabelas...
   ✅ Todas as tabelas necessárias existem

============================================================
✅ Setup Completo!
============================================================

🎯 Sistema pronto para uso:
   Login: admin
   Senha: admin123
```

### 4. Testar Login

1. Acesse: http://213.199.59.34:3333
2. Login: `admin` / `admin123`
3. Deve funcionar! ✅

## 📊 Interpretando os Logs

### Logs de Inicialização Normais

```
============================================================
🗄️  [DATABASE] Configurando conexão PostgreSQL
============================================================
   Host: postgres
   Port: 5432
   Database: warehouse_db
   User: warehouse_user
   Password: ***
============================================================

🔄 [DATABASE] Tentativa de conexão #1...
✅ [DATABASE] Conexão estabelecida com sucesso!
   PostgreSQL Version: PostgreSQL 15.4
   Server Time: 2024-11-10T22:30:00.000Z

📊 [DATABASE] Tabelas encontradas: 4
   - employees
   - payments
   - schedules
   - users

✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)

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

### Logs de Login Bem-Sucedido

```
────────────────────────────────────────────────────────────
📥 [REQUEST] POST /api/auth/login
   Time: 2024-11-10T22:35:00.000Z
   IP: ::ffff:172.18.0.1
   Body: { username: 'admin' }

🔐 [LOGIN] Tentativa de login - Username: admin
📊 [LOGIN] Consultando banco de dados...
📊 [LOGIN] Resultado da query: 1 usuário(s) encontrado(s)
✅ [LOGIN] Usuário encontrado - ID: 1, Role: admin
🔑 [LOGIN] Verificando senha...
✅ [LOGIN] Senha válida
📝 [LOGIN] Atualizando last_login...
🎫 [LOGIN] Gerando token JWT...
✅ [LOGIN] Login bem-sucedido - Usuário: admin, Tempo: 45ms

📤 [RESPONSE] POST /api/auth/login - Status: 200
────────────────────────────────────────────────────────────
```

### Logs de Erro - Tabela Não Existe

```
❌ [LOGIN ERROR] Tempo: 15ms
❌ [LOGIN ERROR] Tipo: error
❌ [LOGIN ERROR] Mensagem: relation "users" does not exist
❌ [LOGIN ERROR] Código PostgreSQL: 42P01
❌ [LOGIN ERROR] Tabela "users" não existe! Execute a migration.
```

**Solução:** Execute `npm run setup` no console do backend

### Logs de Erro - PostgreSQL Não Conecta

```
❌ [DATABASE] Erro na conexão (tentativa 1):
   Tipo: Error
   Mensagem: connect ECONNREFUSED postgres:5432
   Código: ECONNREFUSED
⏳ [DATABASE] Tentando novamente em 3 segundos...
```

**Solução:** Verificar se postgres está rodando

### Logs de Erro - Usuário Não Existe

```
🔐 [LOGIN] Tentativa de login - Username: admin
📊 [LOGIN] Consultando banco de dados...
📊 [LOGIN] Resultado da query: 0 usuário(s) encontrado(s)
❌ [LOGIN] Usuário não encontrado: admin
```

**Solução:** Execute `npm run setup` no console do backend

## 🔧 Comandos Úteis no Portainer

### Ver Logs em Tempo Real

```
Containers → warehouse-backend → Logs
```

Ou via Console:

```bash
tail -f /proc/1/fd/1
```

### Executar Setup

```
Containers → warehouse-backend → Console
```

```bash
npm run setup
```

### Verificar Banco de Dados

```
Containers → warehouse-postgres → Console
```

```bash
psql -U warehouse_user -d warehouse_db

-- Ver tabelas
\dt

-- Ver usuários
SELECT id, username, email, role FROM users;

-- Sair
\q
```

### Testar API

```
Containers → warehouse-backend → Console
```

```bash
# Health check
curl http://localhost:5000/health

# Testar login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🎯 Fluxo de Diagnóstico

```
1. Deploy da Stack no Portainer
   ↓
2. Aguardar build completar (2-5 min)
   ↓
3. Ver logs do backend
   ↓
4. Procurar por:
   - ✅ Conexão com PostgreSQL OK?
   - ✅ Tabelas encontradas?
   - ✅ Usuários existem?
   ↓
5. Se algum ❌, executar: npm run setup
   ↓
6. Testar login no frontend
   ↓
7. ✅ Funcionando!
```

## 📋 Troubleshooting

### Problema: Backend não inicia

**Ver logs:**

```
Containers → warehouse-backend → Logs
```

**Procurar por:**

- `❌ [DATABASE] Falha após 5 tentativas`
- `Error: connect ECONNREFUSED`

**Solução:**

1. Verificar se postgres está rodando: `docker ps`
2. Reiniciar postgres: Stack → Restart
3. Aguardar 10s e reiniciar backend

### Problema: Tabela users não existe

**Log:**

```
❌ [LOGIN ERROR] Código PostgreSQL: 42P01
```

**Solução:**

```bash
# Console do backend
npm run setup
```

### Problema: Nenhum usuário

**Log:**

```
⚠️ [SETUP] Nenhum usuário encontrado!
```

**Solução:**

```bash
# Console do backend
npm run setup
```

### Problema: Senha inválida

**Log:**

```
❌ [LOGIN] Senha inválida para usuário: admin
```

**Solução:**

1. Senha pode ter sido alterada
2. Recriar admin: `npm run setup` (não duplica se já existe)
3. Ou resetar senha via SQL

## 🔄 Rebuild com Logs

Após fazer push das mudanças com logs:

```
1. Portainer → Stack → Pull and redeploy
2. OU: Editor → Update the stack (marcar rebuild)
3. Aguardar build
4. Ver logs: Containers → warehouse-backend → Logs
5. Executar setup: npm run setup
6. Testar
```

## 📝 Agora Você Deve Ver

Quando abrir os logs do backend, deve ver algo como:

```
============================================================
🗄️  [DATABASE] Configurando conexão PostgreSQL
============================================================
🔄 [DATABASE] Tentativa de conexão #1...
✅ [DATABASE] Conexão estabelecida!
📊 [DATABASE] Tabelas encontradas: X
✅ [SETUP] Tabela 'users' encontrada - X usuário(s)
============================================================
🚀 Warehouse Schedule System - Backend API
============================================================
```

Se **não aparecer**, copie os logs e me envie! 🎯

## ✅ Checklist Final

- [ ] Stack deployed no Portainer
- [ ] Build completado sem erros
- [ ] Logs do backend mostram conexão OK
- [ ] `npm run setup` executado
- [ ] Tabela users criada
- [ ] Usuário admin criado
- [ ] Login funciona no frontend
- [ ] CORS configurado (se necessário)

Com esses logs detalhados, **qualquer erro será fácil de identificar!** 🎉
