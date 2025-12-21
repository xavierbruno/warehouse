# 🔧 Criar Arquivo .env

O erro ocorreu porque o arquivo `.env` não existe. Você precisa criar esse arquivo para configurar a connection string do Supabase.

## 📝 Passo 1: Criar arquivo .env

Crie um arquivo chamado `.env` na **raiz do projeto** (mesmo nível que `package.json`):

### No Windows (PowerShell):
```powershell
cd D:\warehouse
New-Item -Path .env -ItemType File
```

### Ou manualmente:
1. Abra o explorador de arquivos
2. Vá até `D:\warehouse`
3. Crie um novo arquivo chamado `.env` (sem extensão, apenas `.env`)

## 📝 Passo 2: Adicionar configuração

Abra o arquivo `.env` e adicione:

```env
# Connection string do Supabase
SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA_AQUI@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
SUPABASE_SSL=true

# JWT Secret (mude em produção)
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
JWT_EXPIRES_IN=24h

# Porta do servidor
PORT=5000
```

**⚠️ IMPORTANTE:** Substitua `SUA_SENHA_AQUI` pela senha real do seu banco Supabase!

## 📝 Passo 3: Verificar formato da connection string

A connection string deve ter o formato:

```
postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres
```

**Exemplo completo:**
```
SUPABASE_DB_URL=postgresql://postgres:minhasenha123@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
```

## ✅ Passo 4: Testar

Depois de criar o `.env`, tente iniciar o servidor novamente:

```bash
cd server
npm start
```

Você deve ver:
```
✅ [DATABASE] Conexão estabelecida com sucesso!
```

## 🔍 Onde encontrar a senha do Supabase?

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Database**
4. Procure por **Database password** ou **Connection string**
5. Se não souber a senha, pode resetar em **Settings** > **Database** > **Reset Database Password**

## ❌ Erro: "Cannot read properties of undefined"

Este erro ocorre quando:
- ❌ O arquivo `.env` não existe
- ❌ A variável `SUPABASE_DB_URL` não está definida
- ❌ A connection string está vazia ou malformada

## 💡 Dica

Se você NÃO quiser usar Supabase e preferir usar PostgreSQL local, basta **não criar** o arquivo `.env` ou **não definir** `SUPABASE_DB_URL`. O sistema usará as configurações padrão do PostgreSQL local.

