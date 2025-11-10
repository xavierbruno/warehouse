# 🔐 Sistema de Autenticação

Documentação completa do sistema de autenticação do Warehouse Schedule System.

## 📋 Visão Geral

O sistema utiliza autenticação JWT (JSON Web Token) para proteger as rotas da API e do frontend.

### Credenciais Padrão

- **Usuário**: `admin`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere a senha padrão imediatamente após o primeiro login em produção!

## 🏗️ Arquitetura

```
Frontend (React)
    ↓
AuthContext (Gerenciamento de Estado)
    ↓
Protected Routes
    ↓
API REST (/api/auth/login)
    ↓
JWT Middleware
    ↓
Protected Endpoints
    ↓
PostgreSQL (users table)
```

## 🗄️ Banco de Dados

### Tabela `users`

| Campo         | Tipo         | Descrição                  |
| ------------- | ------------ | -------------------------- |
| id            | SERIAL       | ID único                   |
| username      | VARCHAR(50)  | Nome de usuário (único)    |
| email         | VARCHAR(255) | Email (único)              |
| password_hash | VARCHAR(255) | Hash bcrypt da senha       |
| role          | VARCHAR(20)  | Papel (admin, user)        |
| is_active     | BOOLEAN      | Conta ativa                |
| last_login    | TIMESTAMP    | Último login               |
| created_at    | TIMESTAMP    | Data de criação            |
| updated_at    | TIMESTAMP    | Data da última atualização |

### Migration

Execute a migration de autenticação:

```bash
# Dentro do container do PostgreSQL
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

# Executar migration
\i /docker-entrypoint-initdb.d/auth_migration.sql

# Verificar
SELECT * FROM users;
```

## 🔧 Setup

### 1. Instalar Dependências do Backend

```bash
cd server
npm install
```

Dependências adicionadas:

- `bcryptjs` - Hash de senhas
- `jsonwebtoken` - Geração e validação de JWT

### 2. Criar Usuário Admin

```bash
cd server
npm run seed
```

Isso criará o usuário admin padrão com as credenciais acima.

### 3. Configurar Variáveis de Ambiente

Adicione ao `.env` do backend:

```bash
JWT_SECRET=sua-chave-secreta-muito-segura-aqui
JWT_EXPIRES_IN=24h
```

### 4. Rebuild dos Containers

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## 📡 Endpoints da API

### POST /api/auth/login

Faz login e retorna token JWT.

**Request:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@warehouse.com",
    "role": "admin",
    "last_login": "2024-11-10T12:00:00.000Z"
  }
}
```

**Errors:**

- `401` - Credenciais inválidas
- `400` - Validação falhou

### GET /api/auth/me

Retorna dados do usuário autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@warehouse.com",
  "role": "admin",
  "last_login": "2024-11-10T12:00:00.000Z",
  "created_at": "2024-11-10T10:00:00.000Z"
}
```

### POST /api/auth/change-password

Altera a senha do usuário autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "currentPassword": "admin123",
  "newPassword": "novaSenhaSegura456"
}
```

**Response (200):**

```json
{
  "message": "Senha alterada com sucesso"
}
```

**Errors:**

- `401` - Senha atual incorreta
- `400` - Nova senha inválida (mínimo 6 caracteres)

### POST /api/auth/logout

Logout do sistema (remove token no cliente).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Logout realizado com sucesso"
}
```

## 🔒 Proteção de Rotas

### Backend

Todas as rotas de API (exceto `/api/auth/login`) estão protegidas com middleware JWT:

```javascript
import { authenticateToken } from "./middleware/auth.js";

app.use("/api/employees", authenticateToken, employeesRouter);
app.use("/api/schedules", authenticateToken, schedulesRouter);
```

### Frontend

Rotas protegidas com `ProtectedRoute`:

```jsx
<Route
  path="/employees"
  element={
    <ProtectedRoute>
      <EmployeeList />
    </ProtectedRoute>
  }
/>
```

## 🎨 Frontend

### AuthContext

Gerencia estado de autenticação:

```javascript
import { useAuth } from "./contexts/AuthContext";

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  // Usar...
}
```

### Login Component

Tela de login responsiva com:

- Validação de formulário
- Loading states
- Mensagens de erro
- Credenciais padrão exibidas

### Automatic Token Injection

O token é automaticamente adicionado a todas as requisições via `api.js`:

```javascript
const token = getAuthToken();
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
```

### Auto-Logout on 401

Se o token expirar, o usuário é automaticamente deslogado:

```javascript
if (response.status === 401 || response.status === 403) {
  localStorage.removeItem("auth_token");
  window.location.href = "/login";
}
```

## 🔐 Segurança

### Senhas

- Hashed com `bcrypt` (10 rounds)
- Nunca armazenadas em texto puro
- Nunca retornadas nas respostas da API

### JWT

- Expira em 24h (configurável)
- Assinado com secret key
- Contém: `id`, `username`, `email`, `role`

### CORS

Configurado para aceitar apenas origens autorizadas em produção.

### Headers de Segurança

- `Helmet.js` ativo
- HTTPS recomendado em produção

## 🧪 Testando

### Login via cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Usar token retornado
TOKEN="<seu-token-aqui>"

# Acessar rota protegida
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN"
```

### Login via Frontend

1. Acesse: http://localhost:3333
2. Será redirecionado para `/login`
3. Use credenciais padrão
4. Será redirecionado para `/employees`

## 🚀 Produção

### Checklist

- [ ] Alterar senha do admin
- [ ] Configurar `JWT_SECRET` forte
- [ ] Configurar CORS corretamente
- [ ] Habilitar HTTPS
- [ ] Configurar expiração do token
- [ ] Implementar refresh tokens (opcional)
- [ ] Adicionar rate limiting no login
- [ ] Logs de tentativas de login
- [ ] 2FA (opcional)

### Alterar Senha Admin

```sql
-- Via PostgreSQL
UPDATE users SET password_hash = '<novo-hash-bcrypt>' WHERE username = 'admin';
```

Ou via endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "SuaSenhaForte@2024"
  }'
```

## 🔄 Fluxo de Autenticação

```
1. Usuário acessa aplicação
   ↓
2. Verificar se há token no localStorage
   ↓ (SIM)
3. Validar token (JWT não expirado)
   ↓ (VÁLIDO)
4. Carregar dados do usuário
   ↓
5. Permitir acesso às rotas

   ↓ (NÃO/INVÁLIDO)
6. Redirecionar para /login
   ↓
7. Usuário faz login
   ↓
8. Backend valida credenciais
   ↓
9. Gerar JWT
   ↓
10. Retornar token + dados do usuário
    ↓
11. Salvar no localStorage
    ↓
12. Redirecionar para aplicação
```

## 🐛 Troubleshooting

### Token expirado

```
Error: Token inválido ou expirado
```

**Solução**: Fazer login novamente

### CORS error

```
Access to fetch blocked by CORS policy
```

**Solução**: Verificar configuração de CORS no backend

### Login não funciona

1. Verificar se backend está rodando
2. Verificar se tabela `users` existe
3. Verificar se usuário admin foi criado
4. Ver logs do backend: `docker-compose logs backend`

## 📚 Documentação Relacionada

- `API.md` - Documentação completa da API
- `DATABASE.md` - Estrutura do banco de dados
- `PRODUCTION.md` - Segurança em produção
- `README.md` - Visão geral do projeto
