# 🚀 Como Rodar o Projeto

## Opção 1: Com Docker e PostgreSQL Local

Esta opção inicia tudo automaticamente (PostgreSQL + Backend + Frontend).

## Opção 1B: Com Docker e Supabase (Banco Online)

Para usar Supabase como banco de dados online:

1. **Configure as variáveis de ambiente:**

   ```bash
   # Crie um arquivo .env na raiz do projeto
   SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA@db.jqohmvkbzpencpbyyubu.supabase.co:5432/postgres
   SUPABASE_SSL=true
   ```

2. **Execute o SQL no Supabase:**

   - Acesse o SQL Editor no dashboard do Supabase
   - Execute o conteúdo de `server/database/supabase-migration.sql`
   - Ver `SUPABASE_SETUP.md` para instruções detalhadas

3. **Subir serviços (sem PostgreSQL local):**

   ```bash
   docker-compose -f docker-compose.supabase.yml up -d
   ```

4. **Acessar a aplicação:**
   - Frontend: http://localhost:3333
   - Backend: http://localhost:5000/api
   - Login: admin / admin123

### Passos:

1. **Subir todos os serviços:**

   ```bash
   npm run docker:up
   ```

2. **Aguardar alguns segundos** (10-15 segundos) para o PostgreSQL inicializar

3. **Configurar o banco de dados e criar admin:**

   **No Windows (PowerShell/Git Bash):**

   ```bash
   # Copiar arquivo de migration para o container
   docker cp server/database/auth_migration.sql warehouse-postgres:/tmp/auth_migration.sql

   # Executar migration
   docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -f /tmp/auth_migration.sql

   # Configurar senha do admin (senha: GLS2025)
   docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -c "UPDATE users SET password = 'GLS2025' WHERE username = 'admin';"
   ```

   **No Linux/Mac:**

   ```bash
   # Executar migration
   docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db < server/database/auth_migration.sql

   # Configurar senha do admin
   docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -c "UPDATE users SET password = 'admin123' WHERE username = 'admin';"
   ```

4. **Acessar a aplicação:**
   - **Frontend**: http://localhost:3333
   - **Backend API**: http://localhost:5000/api
   - **Login**:
     - Usuário: `admin`
     - Senha: `GLS2025`

### Verificar se está funcionando:

```bash
# Ver todos os containers rodando
docker-compose ps

# Ver logs em tempo real
npm run docker:logs

# Health check da API
curl http://localhost:5000/health
```

### Parar os serviços:

```bash
npm run docker:down
```

---

## Opção 2: Desenvolvimento Local

Para desenvolvimento com hot-reload (mudanças refletem automaticamente).

### Pré-requisitos:

- Node.js 18+ instalado
- PostgreSQL rodando (pode usar Docker só para o banco)

### Passos:

1. **Instalar dependências do frontend:**

   ```bash
   npm install
   ```

2. **Instalar dependências do backend:**

   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Subir apenas PostgreSQL via Docker:**

   ```bash
   docker-compose up -d postgres
   ```

4. **Configurar o banco de dados:**

   ```bash
   # Aguardar PostgreSQL iniciar (10 segundos)
   timeout /t 10

   # Copiar e executar migration (Windows)
   docker cp server/database/auth_migration.sql warehouse-postgres:/tmp/auth_migration.sql
   docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -f /tmp/auth_migration.sql

   # Configurar senha do admin
   docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -c "UPDATE users SET password = 'admin123' WHERE username = 'admin';"
   ```

5. **Iniciar o backend:**

   ```bash
   cd server
   npm run dev
   ```

   Backend rodará em: http://localhost:5000

6. **Em outro terminal, iniciar o frontend:**
   ```bash
   npm run dev
   ```
   Frontend rodará em: http://localhost:3000

### Credenciais de Login:

- Usuário: `admin`
- Senha: `GLS2025`

---

## 🐛 Problemas Comuns

### Porta já está em uso

```powershell
# Windows PowerShell - Verificar processos nas portas
netstat -ano | findstr :3333
netstat -ano | findstr :5000
netstat -ano | findstr :5434

# Se encontrar, pode matar o processo ou alterar as portas no docker-compose.yml
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs postgres
docker-compose logs backend
docker-compose logs warehouse-app

# Reconstruir tudo do zero
docker-compose down -v
docker-compose up --build -d
```

### API não conecta ao banco

```bash
# Verificar se postgres está saudável
docker-compose ps

# Deve mostrar "healthy" na coluna Status
# Se não, reiniciar:
docker-compose restart postgres
```

### Erro: "No such file or directory" ao executar migration

Este erro ocorre porque o arquivo não está montado no container. Use este método no Windows:

```bash
# 1. Copiar arquivo para dentro do container
docker cp server/database/auth_migration.sql warehouse-postgres:/tmp/auth_migration.sql

# 2. Executar dentro do container
docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -f /tmp/auth_migration.sql

# 3. Configurar senha do admin
docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db -c "UPDATE users SET password = 'admin123' WHERE username = 'admin';"
```

**Importante:** Use `-i` (não `-it`) no Windows PowerShell para evitar erro de TTY.

---

## 📋 Comandos Úteis

### Docker

```bash
# Subir serviços
npm run docker:up

# Parar serviços
npm run docker:down

# Ver logs
npm run docker:logs

# Reiniciar
npm run docker:restart

# Rebuild imagens
npm run docker:build
```

### Banco de Dados

```bash
# Entrar no PostgreSQL
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

# Listar tabelas
\dt

# Ver estrutura de uma tabela
\d employees

# Fazer backup
docker exec -t warehouse-postgres pg_dump -U warehouse_user warehouse_db > backup.sql
```

---

## ✅ Checklist - Está tudo funcionando?

- [ ] Containers estão rodando (`docker-compose ps`)
- [ ] API responde em http://localhost:5000/health
- [ ] Frontend abre em http://localhost:3333
- [ ] Consigo fazer login com `admin` / `GLS2025`
- [ ] Consigo criar funcionários
- [ ] Consigo criar escalas

---

## 📚 Mais Informação

- `README.md` - Visão geral completa
- `QUICKSTART.md` - Guia rápido detalhado
- `DOCKER.md` - Guia completo do Docker
- `API.md` - Documentação da API
- `DATABASE.md` - Documentação do banco
