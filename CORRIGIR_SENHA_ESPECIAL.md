# 🔧 Corrigir Connection String com Caracteres Especiais

## Problema

Quando a senha do Supabase contém caracteres especiais (como `!`, `@`, `#`, `$`, etc.), a connection string pode não ser interpretada corretamente pelo sistema.

## ✅ Solução

Coloque a connection string **entre aspas duplas** no arquivo `.env`:

### ❌ Formato Incorreto:
```env
SUPABASE_DB_URL=postgresql://postgres:Gls2025!!26@db.xxxxx.supabase.co:5432/postgres
```

### ✅ Formato Correto:
```env
SUPABASE_DB_URL="postgresql://postgres:Gls2025!!26@db.xxxxx.supabase.co:5432/postgres"
```

## 📝 Arquivo .env Completo

```env
# Supabase Configuration
SUPABASE_DB_URL="postgresql://postgres:Gls2025!!26@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres"
SUPABASE_SSL=true

# JWT Secret
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
JWT_EXPIRES_IN=24h

# Porta do servidor
PORT=5000
```

## 🔍 Verificar

Depois de atualizar o `.env`, teste:

```bash
cd server
npm start
```

Você deve ver:
```
✅ [DATABASE] Conexão estabelecida com sucesso!
```

## 💡 Dica

Se ainda não funcionar, você também pode usar **URL encoding** para os caracteres especiais:

- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- etc.

Exemplo:
```env
SUPABASE_DB_URL=postgresql://postgres:Gls2025%21%2126@db.xxxxx.supabase.co:5432/postgres
```

