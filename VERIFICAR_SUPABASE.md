# 🔍 Verificar Configuração do Supabase

## ⚠️ Problema Detectado

O hostname `db.jqohmvkbzpencpbyyubu.supabase.co` retorna apenas IPv6, o que pode causar problemas de conectividade.

## ✅ Ação Imediata Necessária

### 1. Verificar no Dashboard do Supabase

**IMPORTANTE:** O hostname pode estar incorreto ou o projeto pode ter sido alterado.

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Database**
4. Na seção **Connection string**, selecione **URI**
5. **COPIE A CONNECTION STRING COMPLETA E ATUALIZE O .env**

### 2. Verificar Status do Projeto

No dashboard, verifique:
- ✅ Projeto está **Active** (não pausado)
- ✅ Status mostra "Healthy" ou "Running"
- ❌ Se estiver pausado, clique em "Resume" ou "Restore"

### 3. Possível Solução Temporária: Usar PostgreSQL Local

Se precisar trabalhar imediatamente, você pode usar PostgreSQL local enquanto verifica o Supabase:

**Opção A: Remover SUPABASE_DB_URL do .env**

Comente ou remova a linha `SUPABASE_DB_URL` do `.env`:

```env
# SUPABASE_DB_URL=postgresql://postgres:... (comentado temporariamente)
```

E inicie o PostgreSQL local:

```bash
docker-compose up -d postgres
cd server
npm start
```

**Opção B: Usar apenas PostgreSQL Local**

Para desenvolvimento local, você não precisa do Supabase. O sistema funcionará com PostgreSQL local automaticamente se `SUPABASE_DB_URL` não estiver definido.

## 📝 Próximos Passos

1. ✅ Verificar connection string no dashboard do Supabase
2. ✅ Atualizar `.env` com a connection string correta
3. ✅ Verificar se o projeto está ativo
4. ✅ Testar novamente: `cd server && npm start`

## 🔗 Link Útil

- Dashboard Supabase: https://supabase.com/dashboard
- Documentação: https://supabase.com/docs/guides/database/connecting-to-postgres

