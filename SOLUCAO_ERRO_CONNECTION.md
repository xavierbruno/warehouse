# 🔧 Solução: Erro de Conexão com Supabase

## ❌ Erro Encontrado

```
TypeError: Cannot read properties of undefined (reading 'searchParams')
```

## 🔍 Causa

O arquivo `.env` não existe ou a variável `SUPABASE_DB_URL` não está definida.

## ✅ Solução Rápida

### 1. Criar arquivo .env na raiz

Na raiz do projeto (`D:\warehouse`), crie um arquivo `.env`:

**Windows PowerShell:**
```powershell
cd D:\warehouse
@"
SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA_AQUI@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
SUPABASE_SSL=true
JWT_SECRET=sua-chave-secreta-aqui
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8
```

**Ou manualmente:**
1. Crie um arquivo chamado `.env` (sem extensão)
2. Adicione o conteúdo abaixo

### 2. Conteúdo do arquivo .env

```env
SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA_AQUI@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
SUPABASE_SSL=true
JWT_SECRET=sua-chave-secreta-aqui
PORT=5000
```

**⚠️ IMPORTANTE:** 
- Substitua `SUA_SENHA_AQUI` pela senha real do Supabase
- A connection string deve começar com `postgresql://`

### 3. Verificar se funcionou

```bash
cd server
npm start
```

Você deve ver:
```
✅ [DATABASE] Conexão estabelecida com sucesso!
```

## 🔑 Onde encontrar a senha do Supabase?

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Database**
4. Veja **Connection string** ou **Database password**
5. Se não souber, reset em **Reset Database Password**

## 💡 Alternativa: Usar PostgreSQL Local

Se não quiser usar Supabase agora, você pode:

1. **Não criar o arquivo .env** (ou não definir `SUPABASE_DB_URL`)
2. O sistema usará PostgreSQL local automaticamente
3. Certifique-se de que o PostgreSQL está rodando via Docker

## 📋 Checklist

- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] `SUPABASE_DB_URL` definido com connection string completa
- [ ] Senha substituída na connection string
- [ ] Connection string começa com `postgresql://`
- [ ] Arquivo `.env` está na mesma pasta que `package.json`

## 🔍 Debug

Para verificar se o .env está sendo carregado:

```powershell
cd server
node -e "require('dotenv').config(); console.log('SUPABASE_DB_URL:', process.env.SUPABASE_DB_URL ? 'Definido' : 'NÃO DEFINIDO');"
```

