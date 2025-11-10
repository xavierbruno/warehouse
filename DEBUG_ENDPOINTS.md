# 🔍 Endpoints de Debug

## ⚠️ IMPORTANTE
Estes endpoints são para DEBUG apenas. **Remova em produção!**

## 📡 Endpoints Disponíveis

### 1. Verificar Usuário
```bash
GET /api/debug/check-user/:username
```

**Exemplo:**
```bash
curl http://213.199.59.34:5000/api/debug/check-user/admin
```

**Resposta:**
```json
{
  "found": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@warehouse.com",
    "role": "admin",
    "is_active": true,
    "password_hash_preview": "$2b$10$N9qo8uLOickgx2ZMRZoM...",
    "password_hash_length": 60,
    "created_at": "2024-11-10T22:00:00.000Z"
  }
}
```

### 2. Testar Senha
```bash
POST /api/debug/test-password
```

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Exemplo:**
```bash
curl -X POST http://213.199.59.34:5000/api/debug/test-password \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Resposta:**
```json
{
  "match": true,
  "passwordLength": 8,
  "hashLength": 60,
  "hashPreview": "$2b$10$N9qo8uLOickgx2ZMRZoM..."
}
```

### 3. Informações do Banco
```bash
GET /api/debug/database
```

**Exemplo:**
```bash
curl http://213.199.59.34:5000/api/debug/database
```

**Resposta:**
```json
{
  "version": "PostgreSQL 15.4",
  "tables": ["employees", "payments", "schedules", "users"],
  "userCount": "1"
}
```

### 4. Listar Todos os Usuários
```bash
GET /api/debug/all-users
```

**Exemplo:**
```bash
curl http://213.199.59.34:5000/api/debug/all-users
```

**Resposta:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@warehouse.com",
    "role": "admin",
    "is_active": true,
    "last_login": null,
    "created_at": "2024-11-10T22:00:00.000Z"
  }
]
```

## 🎯 Como Usar

### Diagnóstico Completo

Execute estes comandos em ordem:

```bash
# 1. Verificar banco de dados
curl http://213.199.59.34:5000/api/debug/database

# 2. Listar usuários
curl http://213.199.59.34:5000/api/debug/all-users

# 3. Verificar admin
curl http://213.199.59.34:5000/api/debug/check-user/admin

# 4. Testar senha
curl -X POST http://213.199.59.34:5000/api/debug/test-password \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📊 Interpretando Resultados

### ✅ Tudo OK
```json
{
  "found": true,
  "user": {...}
}
```
```json
{
  "match": true,
  "passwordLength": 8,
  "hashLength": 60
}
```
→ Login deveria funcionar!

### ❌ Usuário não existe
```json
{
  "found": false,
  "message": "Usuário não encontrado"
}
```
→ Execute: `npm run setup`

### ❌ Senha não bate
```json
{
  "match": false,
  "passwordLength": 8,
  "hashLength": 60
}
```
→ Hash está errado, recrie o admin: `npm run setup`

### ❌ Tabela não existe
```json
{
  "error": "relation \"users\" does not exist"
}
```
→ Execute migration ou `npm run setup`

## 🔒 Remover em Produção

Quando estiver funcionando, **comente** estas rotas no `server.js`:

```javascript
// REMOVER EM PRODUÇÃO!
// app.use("/api/debug", debugRouter);
```

Ou adicione proteção:

```javascript
if (process.env.NODE_ENV !== 'production') {
  app.use("/api/debug", debugRouter);
}
```

## 📝 Ver Logs

Todos os endpoints de debug geram logs detalhados.

Veja em:
```
Containers → warehouse-backend → Logs
```

## 🎯 Próximos Passos

Após redeploy, execute:

```bash
# 1. Verificar tudo
curl http://213.199.59.34:5000/api/debug/database
curl http://213.199.59.34:5000/api/debug/all-users
curl http://213.199.59.34:5000/api/debug/check-user/admin

# 2. Testar senha
curl -X POST http://213.199.59.34:5000/api/debug/test-password \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. Me envie os resultados!
```

Com isso vamos ver **exatamente** qual é o problema! 🎯

