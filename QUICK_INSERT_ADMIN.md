# ⚡ Insert Rápido - Usuário Admin

## 🎯 Copie e Cole no PostgreSQL

### Via Portainer Console

```
Containers → warehouse-postgres → Console
```

Execute:

```bash
psql -U warehouse_user -d warehouse_db
```

Depois copie e cole este SQL:

```sql
-- Criar tabela users (se não existir)
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

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Inserir/Atualizar usuário admin
-- Senha: admin123
INSERT INTO users (username, email, password_hash, role, is_active)
VALUES (
    'admin',
    'admin@warehouse.com',
    '$2b$10$YQiE3L5L5L5L5L5L5L5L5uK7xCJp8LqYvV7xQx5l5L5L5L5L5L5L5L5L5',
    'admin',
    true
)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash;

-- Verificar
SELECT id, username, email, role, is_active FROM users WHERE username = 'admin';

-- Sair
\q
```

## ⚠️ IMPORTANTE: Gerar Hash Real

O hash acima é um exemplo. Para gerar o hash correto, execute:

### Via Backend Container

```bash
# No Portainer: Containers → warehouse-backend → Console
npm run generate-hash
```

Isso vai gerar o hash correto e o INSERT completo!

## 🚀 Ou Use o Setup Automático

Mais fácil ainda:

```bash
# Console do warehouse-backend
npm run setup
```

Faz tudo automaticamente! ✅

## 📝 Verificar se Funcionou

```sql
-- No psql
SELECT id, username, email, role FROM users;
```

Deve retornar:

```
 id | username | email                  | role
----+----------+------------------------+-------
  1 | admin    | admin@warehouse.com    | admin
```

Agora tente fazer login no frontend! 🎉

## 🔍 Se Ainda Não Funcionar

Execute este comando para ver os logs:

```bash
# Ver logs do backend
docker logs warehouse-backend --tail=50
```

Procure por:

- `✅ [SETUP] Tabela 'users' encontrada - 1 usuário(s)`
- `🔐 [LOGIN] Tentativa de login - Username: admin`

Me envie os logs se ainda tiver erro!
