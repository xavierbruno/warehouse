# ✅ Configurar Session Pooler do Supabase

## 🔍 Connection String Correta

A connection string do **Session Pooler** tem formato diferente da Direct Connection:

### ❌ Direct Connection (Não funciona com IPv4):
```
postgresql://postgres:senha@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
```

### ✅ Session Pooler (IPv4 Compatible):
```
postgresql://postgres.jqohmvkbzpencpbyyubu:senha@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
```

## 📝 Diferenças Importantes

| Item | Direct Connection | Session Pooler |
|------|------------------|----------------|
| **Username** | `postgres` | `postgres.jqohmvkbzpencpbyyubu` |
| **Host** | `db.jqohmvkbzpencpbyyubu.supabase.co` | `aws-1-eu-west-2.pooler.supabase.com` |
| **Porta** | `5432` | `5432` |
| **IPv4** | ❌ Não compatível | ✅ Compatível |

## 🔧 Configurar .env

1. **No Supabase Dashboard:**
   - Vá em **Settings** > **Database**
   - Clique em **"Connect to your project"**
   - Configure:
     - Type: **URI**
     - Source: **Primary Database**
     - Method: **Session pooler**
   - Copie a connection string

2. **Atualize o .env:**
   ```env
   SUPABASE_DB_URL=postgresql://postgres.jqohmvkbzpencpbyyubu:Gls2025%21%2126@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
   SUPABASE_SSL=true
   ```

   **Importante:** Use URL encoding para caracteres especiais na senha:
   - `!` = `%21`
   - `@` = `%40`
   - etc.

3. **Teste:**
   ```bash
   cd server
   npm start
   ```

## ✅ Vantagens do Session Pooler

- ✅ Compatível com IPv4 (resolve o erro ENOTFOUND)
- ✅ Gratuito
- ✅ Performance adequada
- ✅ Proxy IPv4 automático

## 🔍 Verificar se está funcionando

Você deve ver nos logs:

```
🗄️  [DATABASE] Configurando conexão Supabase
   Connection String: postgresql://postgres.jqohmvkbzpencpbyyubu:****@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
✅ [DATABASE] Conexão estabelecida com sucesso!
```

## ❌ Se ainda der erro

1. Verifique se copiou a connection string completa do dashboard
2. Verifique se a senha está codificada corretamente (URL encoding)
3. Verifique se o projeto Supabase está ativo (não pausado)

