# 🚀 Guia de Integração com Supabase

Este guia mostra como configurar o projeto para usar Supabase como banco de dados online.

## 📋 Pré-requisitos

1. Conta no Supabase (gratuita): https://supabase.com
2. Projeto criado no Supabase

## 🔧 Passo 1: Criar Projeto no Supabase

1. Acesse https://supabase.com e faça login
2. Clique em "New Project"
3. Preencha:
   - **Name**: warehouse-schedule (ou outro nome)
   - **Database Password**: Crie uma senha forte (salve ela!)
   - **Region**: Escolha a região mais próxima
4. Clique em "Create new project"
5. Aguarde a criação do projeto (2-3 minutos)

## 🔑 Passo 2: Obter Connection String

1. No dashboard do Supabase, vá em **Settings** > **Database**
2. Na seção **Connection string**, clique em **"Connect to your project"**
3. **IMPORTANTE:** Configure:
   - **Type:** URI
   - **Source:** Primary Database
   - **Method:** **Session Pooler** (⚠️ Use Session Pooler para IPv4 compatibility!)
4. Você verá algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
   ```
   (Note a porta **6543** e o parâmetro `?pgbouncer=true`)
5. Substitua `[YOUR-PASSWORD]` pela senha que você criou
6. **Copie a connection string completa**

⚠️ **ATENÇÃO:** A "Direct connection" (porta 5432) **não é compatível com IPv4** e causará erro `ENOTFOUND`. Sempre use **Session Pooler** (porta 6543)!

## 📝 Passo 3: Executar Migration SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `server/database/supabase-migration.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Você deve ver: "Success. No rows returned" e as tabelas serão criadas

## 🔐 Passo 4: Configurar Variáveis de Ambiente

### Opção A: Usando arquivo .env (Recomendado)

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration
SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA_AQUI@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
SUPABASE_SSL=true

# Ou use variáveis individuais (não recomendado, mas funciona)
# DB_HOST=db.jqohmvkbzpencpbyyubu.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=SUA_SENHA_AQUI
```

### Opção B: Variáveis de ambiente do sistema

**Windows (PowerShell):**

```powershell
$env:SUPABASE_DB_URL="postgresql://postgres:SUA_SENHA@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres"
$env:SUPABASE_SSL="true"
```

**Linux/Mac:**

```bashexport SUPABASE_DB_URL="postgresql://postgres:SUA_SENHA@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres"
export SUPABASE_SSL="true"

```

## 🐳 Passo 5: Configurar Docker (Opcional)

Se você quiser usar Supabase mas ainda manter o Docker Compose rodando (sem o PostgreSQL local):

### Atualizar docker-compose.yml

Comente ou remova o serviço `postgres` e atualize o `backend`:

```yaml
services:
  # PostgreSQL Database - COMENTADO (usando Supabase)
  # postgres:
  #   ...

  # Backend API
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: warehouse-backend
    environment:
      NODE_ENV: production
      PORT: 5000
      # Usar Supabase
      SUPABASE_DB_URL: ${SUPABASE_DB_URL}
      SUPABASE_SSL: ${SUPABASE_SSL:-true}
      # ... outras variáveis
```

## ✅ Passo 6: Verificar Conexão

1. Inicie o backend:

   ```bash
   cd server
   npm install
   npm start
   ```

2. Você deve ver nos logs:
   ```
   🗄️  [DATABASE] Configurando conexão Supabase
   ✅ [DATABASE] Conexão estabelecida com sucesso!
   📊 [DATABASE] Tabelas encontradas: 4
   ```

## 🔍 Verificar no Supabase

1. No dashboard do Supabase, vá em **Table Editor**
2. Você deve ver as tabelas:

   - `users`
   - `employees`
   - `schedules`
   - `payments`

3. Verifique se o usuário admin foi criado:
   - Vá em `users`
   - Deve ter uma linha com `username = 'admin'`

## 🚨 Solução de Problemas

### Erro: "connection refused"

- Verifique se a connection string está correta
- Verifique se substituiu `[YOUR-PASSWORD]` pela senha real
- Verifique se o projeto Supabase está ativo (não pausado)

### Erro: "SSL required"

- Certifique-se que `SUPABASE_SSL=true` está definido
- Ou use a connection string com `?sslmode=require`:
  ```
  postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres?sslmode=require
  ```

### Erro: "relation does not exist"

- Execute o script `supabase-migration.sql` no SQL Editor do Supabase
- Verifique se todas as queries foram executadas com sucesso

### Senha do admin não funciona

Execute no SQL Editor do Supabase:

```sql
UPDATE users SET password = 'GLS2025' WHERE username = 'admin';
```

## 📚 Comandos Úteis

### Conectar via psql (opcional)

```bash
psql "postgresql://postgres:SUA_SENHA@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres"
```

### Verificar tabelas

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### Ver dados do admin

```sql
SELECT id, username, email, role FROM users WHERE username = 'admin';
```

## 🔄 Migrar Dados Existentes

Se você já tem dados no PostgreSQL local e quer migrar para o Supabase:

1. Exportar do PostgreSQL local:

   ```bash
   pg_dump -U warehouse_user -d warehouse_db > backup.sql
   ```

2. No Supabase SQL Editor, executar o backup.sql

   **Nota:** Você pode precisar ajustar o SQL para remover comandos específicos do PostgreSQL local.

## 🌐 Usando em Produção

Para produção, recomenda-se:

1. **Senha forte**: Use uma senha complexa para o banco
2. **Row Level Security (RLS)**: Configure RLS no Supabase para segurança adicional
3. **Backups**: O Supabase faz backups automáticos (plano gratuito inclui 1 backup diário)
4. **Connection Pooling**: Para alta carga, use o connection pooler do Supabase:
   ```
   postgresql://postgres:senha@db.xxxxx.supabase.co:6543/postgres
   ```
   (Porta 6543 é o pooler, 5432 é direto)

## 📞 Suporte

- Documentação Supabase: https://supabase.com/docs
- SQL Editor: https://supabase.com/dashboard/project/_/sql
