# 🚀 Iniciar PostgreSQL Local

## ✅ Status Atual

O sistema detectou que `SUPABASE_DB_URL` não está definido (ou está comentado) no `.env`, então está tentando usar PostgreSQL local.

Mas o erro `ENOTFOUND postgres` significa que o container Docker do PostgreSQL não está rodando.

## 🔧 Solução: Iniciar PostgreSQL

Execute na raiz do projeto:

```bash
docker-compose up -d postgres
```

Aguarde 10-15 segundos para o PostgreSQL inicializar completamente.

## ✅ Verificar se está rodando

```bash
docker-compose ps
```

Você deve ver:

```
warehouse-postgres    ...    Up ...    healthy
```

## 🔄 Depois de iniciar

1. **Configure o banco (se for primeira vez):**

```bash
# Copiar migration
docker cp server/database/auth_migration.sql warehouse-postgres:/tmp/auth_migration.sql

# Executar migration
docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -f /tmp/auth_migration.sql

# Configurar senha do admin
docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -c "UPDATE users SET password = 'GLS2025' WHERE username = 'admin';"
```

2. **Inicie o servidor:**

```bash
cd server
npm start
```

Você deve ver:

```
✅ [DATABASE] Conexão estabelecida com sucesso!
📊 [DATABASE] Tabelas encontradas: 4
```

## 🔄 Alternativa: Usar Supabase

Se preferir usar Supabase, atualize o `.env`:

```env
SUPABASE_DB_URL=postgresql://postgres.jqohmvkbzpencpbyyubu:Gls2025%21%2126@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
SUPABASE_SSL=true
```

E pare o PostgreSQL:

```bash
docker-compose stop postgres
```

## 💡 Recomendação

Para desenvolvimento local, PostgreSQL local é mais rápido e confiável:

- ✅ Funciona offline
- ✅ Sem problemas de rede/DNS
- ✅ Mais rápido
- ✅ Controle total
