# ⚡ Quick Start com Supabase

Guia rápido para usar o projeto com Supabase.

## 🎯 Pré-requisitos

1. Projeto criado no Supabase
2. Connection string do Supabase
3. Node.js e Docker instalados (opcional)

## 📋 Passo a Passo

### 1. Executar Migration no Supabase

1. Acesse o dashboard do Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor** > **New Query**
3. Abra o arquivo `server/database/supabase-migration.sql`
4. Copie todo o conteúdo e cole no SQL Editor
5. Clique em **Run** (ou Ctrl+Enter)
6. Verifique se todas as tabelas foram criadas em **Table Editor**

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Connection string do Supabase
SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA_AQUI@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
SUPABASE_SSL=true

# JWT Secret (altere em produção!)
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
JWT_EXPIRES_IN=24h
```

**⚠️ IMPORTANTE:** Substitua `SUA_SENHA_AQUI` pela senha do seu banco Supabase!

### 3. Rodar o Projeto

#### Opção A: Com Docker (Recomendado)

```bash
# Subir apenas backend e frontend (Supabase já está online)
docker-compose -f docker-compose.supabase.yml up -d

# Ver logs
docker-compose -f docker-compose.supabase.yml logs -f backend
```

#### Opção B: Desenvolvimento Local

```bash
# Instalar dependências
cd server
npm install

# Iniciar backend (lerá SUPABASE_DB_URL do .env)
npm start

# Em outro terminal, iniciar frontend
cd ..
npm install
npm run dev
```

### 4. Verificar Conexão

Você deve ver nos logs do backend:

```
🗄️  [DATABASE] Configurando conexão Supabase
✅ [DATABASE] Conexão estabelecida com sucesso!
📊 [DATABASE] Tabelas encontradas: 4
   - employees
   - payments
   - schedules
   - users
```

### 5. Acessar Aplicação

- **Frontend**: http://localhost:3333 (Docker) ou http://localhost:3000 (dev)
- **Backend**: http://localhost:5000/api
- **Login**: 
  - Usuário: `admin`
  - Senha: `GLS2025`

## ✅ Checklist

- [ ] Migration SQL executada no Supabase
- [ ] Arquivo `.env` criado com `SUPABASE_DB_URL`
- [ ] Backend conectando ao Supabase (ver logs)
- [ ] Tabelas visíveis no Table Editor do Supabase
- [ ] Login funcionando

## 🔧 Solução de Problemas

### Erro: "connection refused"

- Verifique se a connection string está correta
- Verifique se substituiu `[YOUR-PASSWORD]` pela senha real
- Teste a connection string no SQL Editor do Supabase

### Erro: "SSL required"

Adicione `?sslmode=require` ao final da connection string:

```
SUPABASE_DB_URL=postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### Tabelas não aparecem

Execute o `supabase-migration.sql` novamente no SQL Editor.

## 📚 Documentação Completa

Para mais detalhes, veja:
- `SUPABASE_SETUP.md` - Guia completo de configuração
- `COMO_RODAR.md` - Guia geral de execução

