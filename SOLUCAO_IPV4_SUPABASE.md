# ✅ Solução: Problema IPv4 no Supabase

## 🔍 Problema Identificado

O Supabase mostra: **"Not IPv4 compatible"** na connection string direta.

O erro `ENOTFOUND` acontece porque:

- O Supabase está retornando apenas IPv6
- Sua rede/sistema não suporta IPv6 adequadamente
- A resolução DNS falha

## ✅ Soluções

### Opção 1: Usar Session Pooler (Recomendado para Supabase)

O Supabase oferece um **Session Pooler** que é compatível com IPv4!

#### Como configurar:

1. No dashboard do Supabase, na mesma modal de connection string:

   - Altere **Method:** de "Direct connection" para **"Session Pooler"**
   - Copie a nova connection string (terá porta **6543** em vez de 5432)

2. A connection string ficará assim:

   ```
   postgresql://postgres.jqohmvkbzpencpbyyubu:[YOUR-PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
   ```

   **Importante:** Note que:

   - Username é `postgres.jqohmvkbzpencpbyyubu` (não só `postgres`)
   - Host é `aws-1-eu-west-2.pooler.supabase.com` (pooler do Supabase)
   - Porta é `5432` (não 6543)

3. Atualize o `.env`:
   ```env
   SUPABASE_DB_URL=postgresql://postgres.jqohmvkbzpencpbyyubu:SUA_SENHA@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
   SUPABASE_SSL=true
   ```

**Importante:** Use URL encoding para caracteres especiais na senha!

### Opção 2: Continuar com PostgreSQL Local (Mais Simples)

Para desenvolvimento local, PostgreSQL local funciona perfeitamente:

```env
# Comente ou remova SUPABASE_DB_URL
# SUPABASE_DB_URL=...
```

E use:

```bash
docker-compose up -d postgres
cd server
npm start
```

## 📝 Comparação

| Método                | Compatibilidade    | Performance      | Custo    |
| --------------------- | ------------------ | ---------------- | -------- |
| **Direct Connection** | ❌ Só IPv6         | ⭐⭐⭐ Melhor    | Gratuito |
| **Session Pooler**    | ✅ IPv4 + IPv6     | ⭐⭐ Boa         | Gratuito |
| **PostgreSQL Local**  | ✅ Sempre funciona | ⭐⭐⭐ Excelente | Gratuito |

## 🚀 Implementação Rápida

### Se escolher Session Pooler:

1. No Supabase Dashboard, mude para **"Session Pooler"**
2. Copie a connection string (porta 6543)
3. Atualize `.env`:

   ```env
   SUPABASE_DB_URL=postgresql://postgres.jqohmvkbzpencpbyyubu:Gls2025%21%2126@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
   ```

4. Teste:
   ```bash
   cd server
   npm start
   ```

### Se escolher PostgreSQL Local:

1. Garanta que `.env` não tem `SUPABASE_DB_URL`:

   ```env
   # SUPABASE_DB_URL comentado ou removido
   ```

2. Inicie PostgreSQL:

   ```bash
   docker-compose up -d postgres
   ```

3. Configure banco (se necessário):

   ```bash
   docker cp server/database/auth_migration.sql warehouse-postgres:/tmp/auth_migration.sql
   docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -f /tmp/auth_migration.sql
   ```

4. Inicie servidor:
   ```bash
   cd server
   npm start
   ```

## 💡 Recomendação

- **Desenvolvimento local:** Use PostgreSQL local (mais rápido, sem problemas de rede)
- **Produção/Deploy:** Use Session Pooler do Supabase (IPv4 compatível, online)
