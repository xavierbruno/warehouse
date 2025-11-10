# ✅ FIX FINAL - Remover Hash de Senha

## ⚠️ ATENÇÃO

Senha em texto puro **NÃO É SEGURO** para produção! Use apenas em desenvolvimento/teste.

## 🚀 Solução em 2 Comandos

### 1. Atualizar Banco de Dados (DBeaver ou PostgreSQL Console)

```sql
-- Alterar coluna de password_hash para password
ALTER TABLE users RENAME COLUMN password_hash TO password;

-- Atualizar admin com senha em texto puro
UPDATE users
SET password = 'admin123'
WHERE username = 'admin';

-- Verificar
SELECT id, username, email, password, role FROM users WHERE username = 'admin';
```

**Resultado esperado:**

```
id | username | email                 | password  | role
1  | admin    | admin@warehouse.com   | admin123  | admin
```

### 2. Redeploy do Backend

No Portainer:

```
Stack → Pull and redeploy
```

OU via SSH:

```bash
docker-compose down
docker-compose build backend
docker-compose up -d
```

## 📋 OU Use o Setup Automático

### Console do Backend:

```bash
npm run setup
```

Agora o script:

- ✅ Cria tabela com coluna `password` (não `password_hash`)
- ✅ Insere admin com senha `admin123` em texto puro
- ✅ Se admin já existe, **atualiza** a senha para `admin123`

## 🧪 Testar

Após redeploy:

1. **Teste o endpoint:**

   ```
   http://213.199.59.34:5000/api/debug/test-password
   ```

   Body:

   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

   **Deve retornar:**

   ```json
   {
     "match": true
   }
   ```

2. **Tente fazer login:**
   ```
   http://213.199.59.34:3333
   ```
   Login: `admin` / `admin123`

## 📊 Logs Agora Mostrarão:

```
7️⃣  [LOGIN] Verificando senha...
   Método: Comparação direta (texto puro)
8️⃣  [LOGIN] Senha válida: TRUE
✅ [LOGIN] Login bem-sucedido!
```

## ✅ Checklist

- [ ] Executar SQL para renomear coluna
- [ ] Atualizar senha do admin para 'admin123'
- [ ] Redeploy do backend
- [ ] Limpar cache do navegador
- [ ] Testar login
- [ ] Deve funcionar!

## 🔒 Para Produção (Futuro)

Se quiser voltar para hash:

1. Renomeie `password` para `password_hash`
2. Reative bcrypt nos códigos
3. Execute seed novamente

**Agora o sistema usa senha em texto puro!** 🚀
