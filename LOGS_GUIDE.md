# 📝 Guia Rápido - Entendendo os Logs

## 🚀 Como Ver os Logs

### No Portainer:

```
Containers → warehouse-backend → Logs
```

### Via Terminal:

```bash
docker logs warehouse-backend -f --tail=100
```

## 🎯 Logs Adicionados

### ✅ Logs de Sucesso

#### 1. Inicialização

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

✅ [DATABASE] Conexão estabelecida com sucesso!
📊 [DATABASE] Tabelas encontradas: 4
   - employees
   - payments
   - schedules
   - users

✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)

============================================================
🚀 Warehouse Schedule System - Backend API
============================================================
```

#### 2. Login Bem-Sucedido

```
🔐 [LOGIN] Tentativa de login - Username: admin
📊 [LOGIN] Resultado da query: 1 usuário(s) encontrado(s)
✅ [LOGIN] Usuário encontrado - ID: 1, Role: admin
🔑 [LOGIN] Verificando senha...
✅ [LOGIN] Senha válida
✅ [LOGIN] Login bem-sucedido - Usuário: admin, Tempo: 45ms
```

### ❌ Logs de Erro

#### 1. Tabela `users` Não Existe

```
❌ [LOGIN ERROR] Código PostgreSQL: 42P01
❌ [LOGIN ERROR] Tabela "users" não existe! Execute a migration.
```

**Solução:**

```bash
docker exec -it warehouse-backend npm run setup
```

#### 2. PostgreSQL Não Conecta

```
❌ [DATABASE] Erro na conexão (tentativa 1):
   Código: ECONNREFUSED
   Mensagem: connect ECONNREFUSED postgres:5432
```

**Solução:**

```bash
# Verificar se postgres está rodando
docker ps | grep postgres

# Reiniciar
docker-compose restart postgres
sleep 5
docker-compose restart backend
```

#### 3. Usuário Não Encontrado

```
📊 [LOGIN] Resultado da query: 0 usuário(s) encontrado(s)
❌ [LOGIN] Usuário não encontrado: admin
```

**Solução:**

```bash
docker exec -it warehouse-backend npm run setup
```

## 🔧 Comando Mágico - Setup Automático

Execute este comando e ele faz TUDO automaticamente:

```bash
docker exec -it warehouse-backend npm run setup
```

**O que ele faz:**

1. ✅ Verifica conexão com PostgreSQL
2. ✅ Cria tabela `users` se não existir
3. ✅ Cria usuário `admin` se não existir
4. ✅ Verifica todas as tabelas
5. ✅ Mostra status completo

## 📋 Checklist de Diagnóstico

Quando tiver erro 500:

1. **Ver logs do backend:**

   ```
   Portainer → Containers → warehouse-backend → Logs
   ```

2. **Procurar por:**

   - [ ] `✅ [DATABASE] Conexão estabelecida` (deve aparecer)
   - [ ] `📊 [DATABASE] Tabelas encontradas: 4` (deve ser 4+)
   - [ ] `- users` na lista de tabelas (deve aparecer)
   - [ ] `✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)` (deve ser 1+)

3. **Se algum ❌:**

   ```bash
   docker exec -it warehouse-backend npm run setup
   ```

4. **Testar novamente:**
   - Limpar cache do navegador
   - Tentar login

## 🎯 Exemplo Real de Diagnóstico

### Cenário 1: Tudo OK

```
✅ [DATABASE] Conexão estabelecida
📊 [DATABASE] Tabelas encontradas: 4
   - users  ← TEM!
✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)

🔐 [LOGIN] Tentativa de login - Username: admin
✅ [LOGIN] Login bem-sucedido
```

**Resultado:** Login funciona! ✅

### Cenário 2: Falta Tabela

```
✅ [DATABASE] Conexão estabelecida
📊 [DATABASE] Tabelas encontradas: 3
   - employees
   - payments
   - schedules
   (users NÃO aparece) ← PROBLEMA!
⚠️ [SETUP] Tabela 'users' não existe!
```

**Ação:** `npm run setup`

### Cenário 3: Falta Usuário

```
✅ [DATABASE] Conexão estabelecida
📊 [DATABASE] Tabelas encontradas: 4
   - users  ← TEM!
⚠️ [SETUP] Nenhum usuário encontrado! ← PROBLEMA!

🔐 [LOGIN] Tentativa de login - Username: admin
❌ [LOGIN] Usuário não encontrado: admin
```

**Ação:** `npm run setup`

### Cenário 4: PostgreSQL Não Conecta

```
🔄 [DATABASE] Tentativa de conexão #1...
❌ [DATABASE] Erro na conexão
   Código: ECONNREFUSED ← PROBLEMA!
⏳ [DATABASE] Tentando novamente em 3 segundos...
```

**Ação:** Verificar se postgres está rodando

## 💡 Dicas

### Log em Tempo Real

```bash
docker logs warehouse-backend -f
```

### Filtrar Logs

```bash
# Apenas erros
docker logs warehouse-backend 2>&1 | grep "❌"

# Apenas login
docker logs warehouse-backend 2>&1 | grep "LOGIN"

# Apenas database
docker logs warehouse-backend 2>&1 | grep "DATABASE"
```

### Salvar Logs

```bash
docker logs warehouse-backend > backend_logs.txt
```

## 📞 Próximos Passos

1. **Faça commit e push** das mudanças
2. **Redeploy no Portainer**
3. **Ver logs** do backend
4. **Executar** `npm run setup` se necessário
5. **Copiar e me enviar** os logs se tiver dúvidas

**Com esses logs, vamos encontrar qualquer problema rapidamente!** 🎯
