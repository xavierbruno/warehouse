# ✅ Configurado para usar PostgreSQL Local

## O que foi feito

O arquivo `.env` foi atualizado para **desabilitar o Supabase temporariamente** e usar PostgreSQL local.

## 🚀 Como usar agora

### 1. Iniciar PostgreSQL local

```bash
docker-compose up -d postgres
```

### 2. Aguardar PostgreSQL iniciar (10-15 segundos)

### 3. Configurar banco de dados

```bash
# Copiar migration
docker cp server/database/auth_migration.sql warehouse-postgres:/tmp/auth_migration.sql

# Executar migration
docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -f /tmp/auth_migration.sql

# Configurar senha do admin (GLS2025)
docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -c "UPDATE users SET password = 'GLS2025' WHERE username = 'admin';"
```

### 4. Iniciar servidor

```bash
cd server
npm start
```

Você deve ver:
```
✅ [DATABASE] Conexão estabelecida com sucesso!
📊 [DATABASE] Tabelas encontradas: 4
```

## 🔄 Voltar para Supabase (quando resolver o problema DNS)

1. Acesse o dashboard do Supabase
2. Copie a connection string correta
3. Descomente e atualize no `.env`:

```env
SUPABASE_DB_URL=postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres
SUPABASE_SSL=true
```

**Lembre-se:** Use URL encoding para caracteres especiais na senha!

## 📋 Diferenças

| PostgreSQL Local | Supabase |
|-----------------|----------|
| Rodando no Docker | Banco online |
| Porta 5434 | Conecta via internet |
| Dados locais | Dados na nuvem |
| Sem limite de conexões | Limite do plano |

## ✅ Vantagens do PostgreSQL Local

- ✅ Funciona offline
- ✅ Mais rápido para desenvolvimento
- ✅ Sem problemas de DNS/rede
- ✅ Controle total

