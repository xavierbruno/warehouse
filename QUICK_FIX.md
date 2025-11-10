# ⚡ Quick Fix - Erro 500 no Login

## 🎯 Solução em 1 Comando

Após fazer deploy no Portainer, execute:

### No Console do Backend (Portainer)

```
Containers → warehouse-backend → Console
```

Execute:

```bash
npm run setup
```

**Pronto!** Isso cria a tabela `users` e o usuário `admin` automaticamente.

## 📊 Output Esperado

```
============================================================
🚀 Warehouse System - Setup Automático
============================================================

1️⃣  Verificando conexão com PostgreSQL...
   ✅ Conexão OK

2️⃣  Verificando tabela 'users'...
   ✅ Tabela 'users' criada

3️⃣  Verificando usuário admin...
   ✅ Usuário admin criado:
      Username: admin
      Password: admin123

============================================================
✅ Setup Completo!
============================================================
```

Agora tente fazer login novamente! 🎉

## 🔍 Se Não Funcionar

### Ver Logs Detalhados

```
Containers → warehouse-backend → Logs
```

**Copie as primeiras 100 linhas** e me envie.

### Verificar PostgreSQL

```
Containers → warehouse-postgres → Console
```

```bash
psql -U warehouse_user -d warehouse_db -c "\dt"
```

Deve mostrar:

```
- employees
- payments
- schedules
- users  ← Deve aparecer!
```

## 📞 Ainda com Erro?

Me envie os logs do backend que eu te ajudo!

**Logs mostrarão exatamente qual é o problema.** 🎯
