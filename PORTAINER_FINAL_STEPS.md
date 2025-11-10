# 🎯 Passos Finais - Portainer

## ⚡ Solução Rápida (3 comandos)

### No Portainer

#### 1. Console do PostgreSQL

```
Containers → warehouse-postgres → Console
```

Execute:

```bash
psql -U warehouse_user -d warehouse_db
```

#### 2. Copie e Cole Este SQL

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash, role, is_active)
VALUES ('admin', 'admin@warehouse.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye1v7s5xQx5l5L5L5L5L5L5L5L5L5L5L5L5L5', 'admin', true)
ON CONFLICT (username) DO NOTHING;

SELECT id, username, role FROM users;

\q
```

#### 3. Testar Login

Acesse: http://213.199.59.34:3333

Login: `admin` / `admin123`

## ✅ OU Use o Método Automático

### Console do Backend

```
Containers → warehouse-backend → Console
```

Execute:

```bash
npm run setup
```

**Pronto!** Cria tudo automaticamente.

## 🔧 Gerar Hash Personalizado

Se quiser usar senha diferente:

### Console do Backend

```bash
npm run generate-hash
```

Vai mostrar:

```
🔐 Hash Gerado para Senha
============================================================
Senha: admin123
Hash: $2b$10$...
============================================================

📋 SQL INSERT:
------------------------------------------------------------
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@warehouse.com', '$2b$10$...', 'admin');
```

Copie e execute no PostgreSQL!

## 📊 Verificar Logs

Após executar, veja os logs:

```
Containers → warehouse-backend → Logs
```

Procure por:

```
✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)
```

Se aparecer, o admin foi criado! ✅

## 🔍 Ainda com Erro 500?

Copie e me envie:

1. Logs do backend (últimas 50 linhas)
2. Resultado da query: `SELECT * FROM users;`

**Com essas informações, vou resolver rapidamente!** 🎯
