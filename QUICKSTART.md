# ⚡ Quick Start Guide

Guia rápido para começar a usar o Warehouse Schedule System com PostgreSQL.

## 🚀 Início Rápido (30 segundos)

```bash
# 1. Clone o repositório (se ainda não tem)
git clone <seu-repo>
cd warehouse

# 2. Inicie toda a stack
npm run docker:up

# 3. Acesse a aplicação
# Frontend: http://localhost:3333
# Backend API: http://localhost:5000/api
```

Pronto! 🎉

## 📦 O que foi iniciado?

- ✅ PostgreSQL (porta 5433)
- ✅ Backend API REST (porta 5000)
- ✅ Frontend React (porta 3333)
- ✅ Banco de dados inicializado com schema
- ✅ Dados de exemplo (3 funcionários)

## 🔍 Verificar se está funcionando

```bash
# Health check da API
curl http://localhost:5000/health

# Ver containers rodando
docker-compose ps

# Ver logs em tempo real
npm run docker:logs
```

## 🎯 Próximos Passos

### 1. Migrar dados existentes (se aplicável)

Se você tem dados no localStorage:

```bash
# Ver guia de migração
cat MIGRATION.md
```

### 2. Explorar a API

```bash
# Listar funcionários
curl http://localhost:5000/api/employees

# Listar escalas
curl http://localhost:5000/api/schedules
```

### 3. Acessar o Banco de Dados

```bash
# Entrar no PostgreSQL
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

# Comandos úteis:
\dt                    # Listar tabelas
\d employees          # Estrutura da tabela employees
SELECT * FROM employees;
\q                    # Sair
```

## 🛠️ Comandos Essenciais

### Gerenciar Containers

```bash
# Parar tudo
npm run docker:down

# Reiniciar
npm run docker:restart

# Ver logs
npm run docker:logs

# Reconstruir (após mudanças no código)
npm run docker:build
docker-compose up -d
```

### Desenvolvimento

```bash
# Modo desenvolvimento (hot-reload)
npm run docker:dev

# Ou rodar frontend localmente:
npm install
npm run dev
# Acesse: http://localhost:3000
```

### Banco de Dados

```bash
# Backup do banco
docker exec -t warehouse-postgres pg_dump -U warehouse_user warehouse_db > backup.sql

# Restaurar backup
cat backup.sql | docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db

# Reset completo (⚠️ apaga tudo!)
docker-compose down -v
docker-compose up -d
```

## 📚 Documentação Completa

- **`README.md`** - Visão geral do projeto
- **`DOCKER.md`** - Guia completo do Docker
- **`DATABASE.md`** - Documentação do banco de dados
- **`API.md`** - Documentação da API REST
- **`MIGRATION.md`** - Migração de dados

## 🐛 Problemas Comuns

### Porta já em uso

```bash
# Verificar o que está usando a porta
# Windows PowerShell:
netstat -ano | findstr :3333
netstat -ano | findstr :5000
netstat -ano | findstr :5433

# Matar processo ou alterar porta no docker-compose.yml
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs postgres
docker-compose logs backend
docker-compose logs warehouse-app

# Reconstruir do zero
docker-compose down -v --rmi all
docker-compose up --build -d
```

### API não conecta ao banco

```bash
# Verificar se postgres está saudável
docker-compose ps

# Deve mostrar "healthy" na coluna Status

# Reiniciar backend
docker-compose restart backend
```

## 🔐 Credenciais Padrão

### PostgreSQL

- **Host**: localhost
- **Port**: 5433
- **Database**: warehouse_db
- **User**: warehouse_user
- **Password**: warehouse_pass_2024

### URLs

- **Frontend**: http://localhost:3333
- **Backend**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

⚠️ **IMPORTANTE**: Altere as credenciais em produção!

## 🎓 Tutoriais

### Criar um Funcionário

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "department": "Warehouse",
    "position": "Supervisor",
    "hourly_rate": 32.00,
    "email": "maria@example.com",
    "phone": "(11) 98765-1234"
  }'
```

### Criar uma Escala

```bash
curl -X POST http://localhost:5000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "week_key": "2024-45",
    "day_key": "monday",
    "start_time": "08:00",
    "end_time": "17:00",
    "break_minutes": 60,
    "notes": "Turno normal"
  }'
```

### Buscar Escalas da Semana

```bash
curl http://localhost:5000/api/schedules/week/2024-45
```

## 🎉 Tudo Funcionando?

Parabéns! Seu sistema está pronto para uso. Algumas sugestões:

1. ✅ Crie alguns funcionários via interface web
2. ✅ Monte escalas para a semana
3. ✅ Exporte relatórios em PDF
4. ✅ Explore a API REST
5. ✅ Configure backup automático do banco

## 📞 Precisa de Ajuda?

1. Verifique `DOCKER.md` para problemas com containers
2. Veja `DATABASE.md` para questões do banco
3. Consulte `API.md` para dúvidas sobre endpoints
4. Leia `MIGRATION.md` se está migrando dados

---

**Dica**: Mantenha os containers rodando em background e acesse sempre que precisar! 🚀
