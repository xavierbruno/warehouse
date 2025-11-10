# 🚀 Setup do Sistema de Autenticação

Guia rápido para configurar e usar o sistema de autenticação.

## ⚡ Quick Start (30 segundos)

```bash
# 1. Parar containers existentes
docker-compose down

# 2. Rebuild com novas dependências
docker-compose build

# 3. Iniciar stack
docker-compose up -d

# 4. Aguardar PostgreSQL iniciar (5-10 segundos)
sleep 10

# 5. Executar migration de autenticação
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -f /docker-entrypoint-initdb.d/auth_migration.sql

# 6. Criar usuário admin
docker exec -it warehouse-backend npm run seed

# Pronto! Acesse: http://localhost:3333
```

## 📝 Credenciais Padrão

- **Usuário**: `admin`
- **Senha**: `admin123`

⚠️ **Altere a senha após o primeiro login!**

## 🔧 Setup Detalhado

### 1. Preparar Backend

```bash
cd server
npm install
```

Isso instalará:

- `bcryptjs` - Para hash de senhas
- `jsonwebtoken` - Para autenticação JWT

### 2. Configurar Variáveis de Ambiente

Crie `server/.env`:

```bash
JWT_SECRET=sua-chave-secreta-aqui-muito-segura
JWT_EXPIRES_IN=24h
```

### 3. Criar Tabela de Usuários

Execute a migration:

```bash
# Opção 1: Via Docker
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

# Dentro do psql:
\i /docker-entrypoint-initdb.d/auth_migration.sql

# Opção 2: Diretamente
cat server/database/auth_migration.sql | docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db
```

### 4. Criar Usuário Admin

```bash
# Via container
docker exec -it warehouse-backend npm run seed

# Ou localmente (se servidor estiver rodando local)
cd server
npm run seed
```

**Output esperado:**

```
✅ Usuário admin criado com sucesso!
   Username: admin
   Email: admin@warehouse.com
   Password: admin123

⚠️  IMPORTANTE: Altere a senha padrão em produção!
```

### 5. Rebuild Containers

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### 6. Verificar

```bash
# 1. Health check da API
curl http://localhost:5000/health

# 2. Testar login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Deve retornar um token JWT
```

### 7. Acessar Frontend

1. Abra: http://localhost:3333
2. Será redirecionado para `/login`
3. Use credenciais: `admin` / `admin123`
4. Será redirecionado para `/employees`

## 🎯 Fluxo de Uso

### Primeira Vez

```
1. Acessa http://localhost:3333
   ↓
2. Redireciona para /login
   ↓
3. Login com admin/admin123
   ↓
4. Token JWT salvo no localStorage
   ↓
5. Redireciona para /employees
   ↓
6. Todas as requisições incluem token automaticamente
```

### Sessões Seguintes

```
1. Acessa http://localhost:3333
   ↓
2. Verifica token no localStorage
   ↓
3. Token válido? → Acessa direto
   ↓
4. Token expirado? → Redireciona para /login
```

## 🔐 Alterar Senha Admin

### Via API

```bash
# 1. Fazer login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# 2. Alterar senha
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "MinhaNovaS3nha!"
  }'
```

### Via Banco de Dados

```bash
# 1. Gerar hash da nova senha (use Node.js)
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('MinhaNovaS3nha!', 10, (e,h) => console.log(h));"

# 2. Atualizar no banco
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

UPDATE users SET password_hash = '<hash-gerado>' WHERE username = 'admin';
```

## 📊 Verificar Status

### Verificar Usuários

```sql
-- Conectar ao banco
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

-- Listar usuários
SELECT id, username, email, role, is_active, last_login FROM users;

-- Ver detalhes
SELECT * FROM users WHERE username = 'admin';
```

### Logs do Backend

```bash
# Ver logs em tempo real
docker-compose logs -f backend

# Ver últimas 50 linhas
docker-compose logs --tail=50 backend
```

### Testar Endpoints

```bash
# 1. Login (público)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Salvar token
TOKEN="<copie-o-token-aqui>"

# 3. Obter perfil (protegido)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Listar funcionários (protegido)
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN"
```

## 🐛 Troubleshooting

### Erro: "Tabela users não existe"

```bash
# Executar migration
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -f /docker-entrypoint-initdb.d/auth_migration.sql
```

### Erro: "Credenciais inválidas"

```bash
# Recriar usuário admin
docker exec -it warehouse-backend npm run seed
```

### Erro: "Token inválido"

- Token expirou (24h)
- Faça login novamente
- Verifique JWT_SECRET no .env

### Erro: "CORS policy"

- Verifique CORS_ORIGIN no backend
- Certifique-se que frontend está acessando URL correta

### Backend não inicia

```bash
# Ver erro
docker-compose logs backend

# Reinstalar dependências
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

### Frontend não faz login

1. Abra DevTools (F12)
2. Veja Console para erros
3. Veja Network tab para requisições
4. Verifique se backend está respondendo

## 🔄 Reset Completo

Se algo der muito errado:

```bash
# 1. Parar tudo
docker-compose down -v

# 2. Limpar imagens
docker-compose down --rmi all

# 3. Rebuild do zero
docker-compose build --no-cache

# 4. Subir
docker-compose up -d

# 5. Aguardar
sleep 10

# 6. Migrations
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -f /docker-entrypoint-initdb.d/auth_migration.sql

# 7. Seed admin
docker exec -it warehouse-backend npm run seed
```

## 📚 Documentação Relacionada

- `AUTH.md` - Documentação completa de autenticação
- `API.md` - Endpoints da API
- `DATABASE.md` - Estrutura do banco de dados
- `README.md` - Visão geral do projeto

## ✅ Checklist

- [ ] Backend rodando
- [ ] PostgreSQL rodando
- [ ] Tabela `users` criada
- [ ] Usuário admin criado
- [ ] Frontend acessível
- [ ] Login funcionando
- [ ] Token sendo salvo
- [ ] Rotas protegidas funcionando
- [ ] Logout funcionando
- [ ] Senha alterada (produção)

Pronto! Sistema de autenticação configurado e funcionando! 🎉
