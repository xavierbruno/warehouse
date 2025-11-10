# ⚡ APLICAR AGORA - Remover Hash de Senha

## 🎯 Execute no DBeaver (COPY & PASTE)

### SQL para Executar:

```sql
-- 1. Renomear coluna de password_hash para password
ALTER TABLE users RENAME COLUMN password_hash TO password;

-- 2. Atualizar admin com senha em texto puro
UPDATE users
SET password = 'admin123'
WHERE username = 'admin';

-- 3. Verificar
SELECT id, username, email, password, role, is_active
FROM users
WHERE username = 'admin';
```

**Resultado esperado:**

```
id | username | email                 | password  | role  | is_active
1  | admin    | admin@warehouse.com   | admin123  | admin | t
```

## 🔄 Redeploy do Backend

No Portainer:

```
Stacks → warehouse-schedule-system → Pull and redeploy
```

OU:

```
Stacks → Editor → Update the stack (marcar rebuild)
```

## ✅ Testar

1. Aguardar build completar (2-3 minutos)

2. Acesse: http://213.199.59.34:3333

3. Login:

   - **Username:** `admin`
   - **Password:** `admin123`

4. **Deve funcionar!** 🎉

## 📊 Ver Logs

Os logs agora vão mostrar:

```
7️⃣  [LOGIN] Verificando senha...
   Password recebido: 8 caracteres
   Password no banco: 8 caracteres
   Método: Comparação direta (texto puro)
8️⃣  [LOGIN] Senhas coincidem: TRUE
✅ [LOGIN] Senha validada com sucesso!
✅✅✅ [LOGIN SUCESSO] ✅✅✅
```

## 🧪 Testar Antes (Opcional)

Endpoint de debug:

```
http://213.199.59.34:5000/api/debug/test-password
```

POST Body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Deve retornar:

```json
{
  "match": true
}
```

## ⚠️ Mudanças Aplicadas:

- ✅ `server/database/init.sql` - Tabela usa `password` ao invés de `password_hash`
- ✅ `server/routes/auth.js` - Comparação direta sem bcrypt
- ✅ `server/scripts/seed-admin.js` - Cria admin sem hash
- ✅ `server/scripts/setup.js` - Setup sem hash
- ✅ `server/routes/debug.js` - Debug endpoints atualizados

## 🎯 Ordem de Execução:

```
1. Execute o SQL no DBeaver ✓
2. Redeploy no Portainer
3. Aguarde build (2-3 min)
4. Teste login
5. Sucesso! 🎉
```

**Agora vai funcionar sem hash!** 🚀
