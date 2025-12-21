# 🚀 Deploy Gratuito Completo

Guia passo a passo para fazer deploy **100% GRATUITO** do seu sistema Warehouse.

## 📦 Arquitetura Gratuita

- **Frontend**: Vercel (GRATUITO) ✅
- **Backend**: Render ou Railway (GRATUITO com limitações) ✅
- **Banco de Dados**: Supabase (GRATUITO até 500MB) ✅

---

## 🎯 Opção 1: Render + Vercel (Recomendado)

### ✅ Vantagens
- **100% Gratuito** para começar
- Render oferece 750 horas gratuitas/mês
- Vercel é ilimitado para projetos pessoais
- Deploy automático via GitHub

---

## 📝 Passo a Passo Completo

### **PASSO 1: Preparar o Código no GitHub**

1. **Criar repositório no GitHub** (se ainda não tiver)
   ```bash
   git init
   git add .
   git commit -m "Preparar para deploy"
   git remote add origin https://github.com/SEU_USUARIO/warehouse-schedule.git
   git push -u origin main
   ```

2. **Adicionar `.gitignore`** (se não existir)
   ```
   .env
   node_modules/
   dist/
   .env.local
   .env.production
   ```

---

### **PASSO 2: Configurar Supabase (Banco de Dados)**

✅ Você já tem Supabase configurado! Se não tiver:

1. Acesse: https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em **Settings → Database → Connection String**
5. Copie a **Session Pooler URL** (porta 6543)

**Configuração necessária:**
- **Session Pooler URL**: `postgresql://postgres.xxxxx:senha@aws-0-xxx.pooler.supabase.com:6543/postgres`

---

### **PASSO 3: Deploy do Backend no Render**

1. **Acesse**: https://render.com
2. **Cadastre-se** gratuitamente (usando GitHub)
3. **Clique em**: "New +" → "Web Service"
4. **Conecte seu repositório GitHub**
5. **Configure o serviço**:

   **Configurações Básicas:**
   - **Name**: `warehouse-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: `Free`

   **Variáveis de Ambiente** (Environment Variables):
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_DB_URL=postgresql://postgres.xxxxx:senha@aws-0-xxx.pooler.supabase.com:6543/postgres
   SUPABASE_SSL=true
   JWT_SECRET=seu-jwt-secret-super-seguro-aqui-altere-isso
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://seu-frontend.vercel.app
   ```

   **⚠️ IMPORTANTE:**
   - Substitua `SUPABASE_DB_URL` pela sua URL do Supabase
   - Use a **Session Pooler URL** (porta 6543) para evitar problemas IPv4
   - Altere `JWT_SECRET` para uma string segura e aleatória
   - `CORS_ORIGIN` será configurado depois (URL do frontend no Vercel)

6. **Clique em**: "Create Web Service"
7. **Aguarde o deploy** (pode demorar 5-10 minutos na primeira vez)

8. **Anote a URL** do backend:
   - Exemplo: `https://warehouse-backend.onrender.com`
   - Esta será a URL da sua API

---

### **PASSO 4: Configurar Build do Backend**

Crie arquivo `server/package.json` (se já existe, verifique se tem `"engines"`):

```json
{
  "name": "warehouse-backend",
  "version": "1.0.0",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

Certifique-se que `server/server.js` está configurado para usar a porta do ambiente:

```javascript
const PORT = process.env.PORT || 5000;
```

---

### **PASSO 5: Deploy do Frontend no Vercel**

1. **Acesse**: https://vercel.com
2. **Cadastre-se** gratuitamente (usando GitHub)
3. **Clique em**: "Add New..." → "Project"
4. **Importe seu repositório** do GitHub
5. **Configure o projeto**:

   **Framework Preset**: Vite
   
   **Root Directory**: `./` (raiz do projeto)

   **Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

   **Environment Variables**:
   ```
   VITE_API_URL=https://warehouse-backend.onrender.com/api
   ```
   ⚠️ Substitua pela URL do seu backend no Render

6. **Clique em**: "Deploy"
7. **Aguarde o deploy** (geralmente 2-3 minutos)

8. **Anote a URL** do frontend:
   - Exemplo: `https://warehouse-schedule.vercel.app`
   - Esta será a URL do seu sistema

---

### **PASSO 6: Atualizar CORS no Backend (Render)**

Após obter a URL do Vercel:

1. Volte ao **Render Dashboard**
2. Vá em **Environment** → **Environment Variables**
3. Atualize `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://warehouse-schedule.vercel.app
   ```
4. **Save Changes** (o serviço reinicia automaticamente)

---

### **PASSO 7: Migrar Banco de Dados para Supabase**

Se ainda não migrou o schema:

1. **Acesse o Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute o conteúdo de `server/database/supabase-migration.sql`

Ou via linha de comando:
```bash
# Instalar supabase CLI (opcional)
npm install -g supabase

# Ou copiar e colar o SQL direto no dashboard
```

---

### **PASSO 8: Testar o Sistema**

1. **Acesse**: `https://warehouse-schedule.vercel.app`
2. **Login**:
   - Usuário: `admin`
   - Senha: `GLS2025`
3. **Teste criar funcionários e escalas**

---

## 🔄 Atualizações Futuras

### Deploy Automático

Ambos Vercel e Render fazem **deploy automático** quando você faz `git push`:

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
# Deploy automático em ~5 minutos
```

---

## 🎯 Opção 2: Railway (Alternativa)

Se preferir Railway em vez de Render:

### **Railway para Backend**

1. Acesse: https://railway.app
2. Cadastre-se (usando GitHub)
3. "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Configure:

   **Settings → Variables**:
   ```
   NODE_ENV=production
   PORT=${{PORT}}
   SUPABASE_DB_URL=postgresql://...
   SUPABASE_SSL=true
   JWT_SECRET=...
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://seu-frontend.vercel.app
   ```

   **Settings → Build**:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

6. Railway usa porta automática via `${{PORT}}`

---

## 📊 Limitações dos Planos Gratuitos

### Render Free
- ✅ 750 horas/mês (o suficiente para 1 serviço 24/7)
- ⚠️ Pode "dormir" após 15 minutos de inatividade
- ⚠️ Primeira requisição após dormir pode demorar ~30s

### Vercel Free
- ✅ Deploy ilimitado
- ✅ Bandwidth: 100GB/mês
- ✅ SSL incluído
- ✅ Sem limitações de tráfego para projetos pessoais

### Supabase Free
- ✅ 500MB de banco de dados
- ✅ 2GB de transferência/mês
- ✅ API ilimitada
- ✅ SSL incluído

---

## 🎨 Domínio Personalizado (Opcional - Pago)

Se quiser um domínio personalizado (não gratuito):

### Vercel
1. Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

### Render
1. Settings → Custom Domain
2. Adicione seu domínio
3. Configure DNS

---

## 🐛 Troubleshooting

### Backend não conecta ao Supabase

✅ **Solução**: Use a **Session Pooler URL** (porta 6543), não a Direct Connection (porta 5432)

### CORS Error no Frontend

✅ **Solução**: Atualize `CORS_ORIGIN` no Render com a URL exata do Vercel (sem barra final)

### Frontend não encontra API

✅ **Solução**: Verifique se `VITE_API_URL` no Vercel está correto e termina com `/api`

### Backend "dorme" no Render

✅ **Solução**: Isso é normal no plano free. Use Railway se precisar que fique sempre ativo (mas Railway também tem limites)

---

## 📝 Checklist Final

- [ ] Código no GitHub
- [ ] Supabase configurado e migrado
- [ ] Backend deployado no Render/Railway
- [ ] Frontend deployado no Vercel
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente configuradas
- [ ] Sistema testado e funcionando
- [ ] Login funcionando (admin/GLS2025)

---

## 🎉 Pronto!

Seu sistema está **100% GRATUITO** e online! 🚀

- **Frontend**: `https://seu-projeto.vercel.app`
- **Backend**: `https://seu-backend.onrender.com`
- **Banco**: Supabase (gerenciado)

