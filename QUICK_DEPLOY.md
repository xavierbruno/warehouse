# ⚡ Deploy Rápido - 15 Minutos

Guia **ultra-rápido** para colocar seu sistema online GRÁTIS.

## 🎯 Stack Gratuita

- Frontend: **Vercel** (ilimitado) ✅
- Backend: **Render** (750h/mês grátis) ✅
- Banco: **Supabase** (500MB grátis) ✅

---

## 📋 Checklist Pré-Deploy

- [ ] Código no GitHub
- [ ] Conta Supabase criada
- [ ] Banco migrado no Supabase

---

## 🚀 Passo a Passo Rápido

### 1️⃣ Backend no Render (5 min)

1. https://render.com → Sign up (GitHub)
2. "New +" → "Web Service"
3. Conecte repositório GitHub
4. Configure:

   - **Name**: `warehouse-backend`
   - **Build**: `cd server && npm install`
   - **Start**: `cd server && npm start`
   - **Plan**: `Free`

5. **Environment Variables**:

   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_DB_URL=sua-url-aqui
   SUPABASE_SSL=true
   JWT_SECRET=use-um-gerador-aleatorio
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=*
   ```

   ⚠️ Depois atualize `CORS_ORIGIN` com URL do Vercel

6. **Deploy** → Aguarde ~5min
7. **Copie a URL**: `https://warehouse-backend.onrender.com`

---

### 2️⃣ Frontend no Vercel (3 min)

1. https://vercel.com → Sign up (GitHub)
2. "Add New..." → "Project"
3. Importe repositório
4. Configure:

   - **Framework**: Vite
   - **Root**: `./`
   - **Build**: `npm run build`
   - **Output**: `dist`

5. **Environment Variables**:

   ```
   VITE_API_URL=https://warehouse-backend.onrender.com/api
   ```

   ⚠️ Substitua pela URL do seu backend

6. **Deploy** → Aguarde ~2min
7. **Copie a URL**: `https://warehouse-schedule.vercel.app`

---

### 3️⃣ Atualizar CORS (2 min)

1. Volte ao **Render Dashboard**
2. Environment → Edite `CORS_ORIGIN`
3. Coloque: `https://warehouse-schedule.vercel.app`
4. Save → Reinicia automaticamente

---

### 4️⃣ Testar (1 min)

1. Acesse URL do Vercel
2. Login: `admin` / `GLS2025`
3. ✅ Pronto!

---

## 🔄 Atualizações

```bash
git add .
git commit -m "Update"
git push
# Deploy automático em ~5min
```

---

## 🐛 Problemas Comuns

**Backend não conecta?**
→ Use Session Pooler URL do Supabase (porta 6543)

**CORS Error?**
→ Verifique `CORS_ORIGIN` no Render (sem barra final)

**404 no frontend?**
→ Verifique `VITE_API_URL` termina com `/api`

---

## 💡 Dica

Salve as URLs:

- Frontend: `https://...`
- Backend: `https://...`
- Supabase Dashboard: `https://...`
