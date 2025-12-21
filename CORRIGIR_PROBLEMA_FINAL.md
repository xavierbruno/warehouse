# 🔧 Correção Final - Connection String com Caracteres Especiais

## ❌ Problema

O erro `Cannot read properties of undefined (reading 'searchParams')` ocorre porque a biblioteca `pg-connection-string` não consegue fazer parse da connection string quando ela contém caracteres especiais na senha.

## ✅ Solução: Usar URL Encoding na Senha

A senha `Gls2025!!26` contém `!` que precisa ser codificado como `%21` na URL.

### Opção 1: Codificar manualmente (Recomendado)

Atualize o `.env` para usar URL encoding:

```env
SUPABASE_DB_URL="postgresql://postgres:Gls2025%21%2126@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres"
```

Onde:
- `!` = `%21`
- Então `Gls2025!!26` vira `Gls2025%21%2126`

### Opção 2: Remover aspas e usar URL encoding

```env
SUPABASE_DB_URL=postgresql://postgres:Gls2025%21%2126@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
```

## 📝 Arquivo .env Completo Atualizado

```env
# Supabase Configuration
SUPABASE_DB_URL=postgresql://postgres:Gls2025%21%2126@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
SUPABASE_SSL=true

# JWT Secret
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
JWT_EXPIRES_IN=24h

# Porta do servidor
PORT=5000
```

## 🔄 Tabela de URL Encoding

| Caractere | Encoding |
|-----------|----------|
| `!` | `%21` |
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `*` | `%2A` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |

## ✅ Testar

Depois de atualizar o `.env`:

```bash
cd server
npm start
```

Você deve ver:
```
✅ [DATABASE] Conexão estabelecida com sucesso!
```

