# ✅ Senha do Admin Atualizada

A senha padrão do usuário admin foi atualizada de `admin123` para `GLS2025`.

## 🔑 Nova Senha

- **Usuário**: `admin`
- **Senha**: `GLS2025`

## 📝 Arquivos Atualizados

### Scripts SQL
- ✅ `server/database/init.sql`
- ✅ `server/database/supabase-migration.sql`

### Scripts Node.js
- ✅ `server/scripts/seed-admin.js`
- ✅ `server/scripts/setup.js`
- ✅ `server/scripts/generate-hash.js`

### Código Backend
- ✅ `server/routes/auth.js` (logs)

### Código Frontend
- ✅ `src/components/Login.jsx`

### Documentação
- ✅ `README.md`
- ✅ `COMO_RODAR.md`
- ✅ `SUPABASE_SETUP.md`
- ✅ `CONFIGURAR_SUPABASE_AGORA.md`
- ✅ `QUICKSTART_SUPABASE.md`

## 🔄 Se o banco já existe

Se você já tem o banco de dados configurado e quer atualizar a senha existente:

### PostgreSQL Local (Docker)
```bash
docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -c "UPDATE users SET password = 'GLS2025' WHERE username = 'admin';"
```

### Supabase
Execute no SQL Editor do Supabase:
```sql
UPDATE users SET password = 'GLS2025' WHERE username = 'admin';
```

## ⚠️ Importante

- A senha agora é **GLS2025** (não mais admin123)
- Esta é uma senha padrão - altere em produção!
- Use um sistema de hash de senha adequado em produção

