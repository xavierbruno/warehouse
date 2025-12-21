# ⚡ Configurar Supabase Agora

Guia rápido usando sua connection string do Supabase.

## 🔑 Sua Connection String

```
postgresql://postgres:[YOUR-PASSWORD]@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
```

## 📝 Passo 1: Executar SQL no Supabase

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Abra o arquivo `server/database/supabase-migration.sql` e copie todo o conteúdo
5. Cole no editor SQL
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Deve aparecer: "Success. No rows returned"

✅ **Verificar:** Vá em **Table Editor** e confirme que as tabelas foram criadas:
- `users`
- `employees`
- `schedules`
- `payments`

## 🔐 Passo 2: Criar Arquivo .env

Na raiz do projeto, crie um arquivo `.env`:

```env
# Substitua [YOUR-PASSWORD] pela senha real do seu Supabase
SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA_REAL_AQUI@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
SUPABASE_SSL=true

# JWT (mude em produção)
JWT_SECRET=sua-chave-secreta-mude-em-producao
JWT_EXPIRES_IN=24h
```

**⚠️ IMPORTANTE:** 
- Substitua `SUA_SENHA_REAL_AQUI` pela senha que você criou ao configurar o projeto no Supabase
- Se você não lembra a senha, pode resetar em: Settings > Database > Reset Database Password

## 🚀 Passo 3: Rodar o Projeto

### Opção A: Com Docker (Recomendado)

```bash
# Subir backend e frontend (usando Supabase como banco)
docker-compose -f docker-compose.supabase.yml up -d

# Ver logs para confirmar conexão
docker-compose -f docker-compose.supabase.yml logs -f backend
```

Você deve ver:
```
🗄️  [DATABASE] Configurando conexão Supabase
✅ [DATABASE] Conexão estabelecida com sucesso!
📊 [DATABASE] Tabelas encontradas: 4
```

### Opção B: Desenvolvimento Local

```bash
# Terminal 1 - Backend
cd server
npm install
npm start

# Terminal 2 - Frontend
cd ..
npm install
npm run dev
```

## ✅ Passo 4: Testar

1. **Acesse:** http://localhost:3333 (Docker) ou http://localhost:3000 (dev)
2. **Login:**
   - Usuário: `admin`
   - Senha: `GLS2025`

## 🔍 Verificar no Supabase

No dashboard do Supabase, vá em **Table Editor** > **users** e confirme que existe o usuário admin.

## ❌ Problemas?

### Erro de conexão

1. Verifique se a senha na connection string está correta
2. Verifique se o projeto Supabase não está pausado
3. Teste a connection string no SQL Editor do Supabase

### Tabelas não existem

Execute o `supabase-migration.sql` novamente no SQL Editor.

### Senha do admin não funciona

Execute no SQL Editor do Supabase:

```sql
UPDATE users SET password = 'GLS2025' WHERE username = 'admin';
```

## 📚 Mais Informação

- `SUPABASE_SETUP.md` - Guia completo
- `QUICKSTART_SUPABASE.md` - Quick start detalhado

