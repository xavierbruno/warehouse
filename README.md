# Warehouse Schedule System

Sistema de controle de escala de trabalho para warehouse com interface moderna e responsiva.

## 🚀 Funcionalidades

- **🔐 Autenticação JWT**: Sistema de login seguro com usuário admin
- **Gestão de Funcionários**: Cadastro e gerenciamento de funcionários com cargos (Operador/Supervisor)
- **Criação de Escalas**: Sistema semanal com seleção de dias e horários AM/PM
- **Cálculo de Pagamentos**: Cálculo automático baseado em horas trabalhadas e cargos
- **Banco de Dados PostgreSQL**: Armazenamento persistente e confiável
- **API REST**: Backend Node.js/Express para gerenciamento de dados
- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- **Branding GLS**: Logo e cores corporativas implementadas
- **Docker**: Stack completa containerizada para fácil deployment

## 🏗️ Arquitetura

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │ ───> │  Backend    │ ───> │  PostgreSQL  │
│   (React)   │      │  (Express)  │      │   Database   │
│  Port 3333  │      │  Port 5000  │      │  Port 5433   │
└─────────────┘      └─────────────┘      └──────────────┘
```

## 🛠️ Tecnologias

### Frontend

- React 18
- Vite
- React Router
- Date-fns
- jsPDF
- CSS3 com responsividade

### Backend

- Node.js 18
- Express
- PostgreSQL 15
- Helmet (segurança)
- Express Validator

### DevOps

- Docker & Docker Compose
- Nginx (production)
- Heroku ready

## 🚀 Quick Start

### Com Docker (Recomendado)

```bash
# 1. Iniciar toda a stack (PostgreSQL + Backend + Frontend)
npm run docker:up

# 2. Aguardar PostgreSQL iniciar (10 segundos)
sleep 10

# 3. Executar migration de autenticação
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db -f /docker-entrypoint-initdb.d/auth_migration.sql

# 4. Criar usuário admin
docker exec -it warehouse-backend npm run seed

# Acessar
# Frontend: http://localhost:3333
# Login: admin / admin123
```

### Desenvolvimento Local

```bash
# 1. Iniciar PostgreSQL e Backend via Docker
docker-compose up -d postgres backend

# 2. Instalar dependências do frontend
npm install

# 3. Executar frontend em desenvolvimento
npm run dev

# Acessar: http://localhost:3000
```

## 📱 URLs

- **Frontend**: http://localhost:3333 (produção) ou http://localhost:3000 (dev)
- **Backend API**: http://localhost:5000/api
- **API Docs**: Ver `API.md`
- **Database**: localhost:5433

## 🎯 Como Usar

1. **Cadastrar Funcionários**: Adicione funcionários com nome, cargo, salário, etc.
2. **Criar Escalas**: Selecione dias da semana e horários de trabalho
3. **Calcular Pagamentos**: Visualize os valores a serem pagos por funcionário
4. **Exportar PDF**: Exporte escalas e relatórios em PDF

## 💰 Sistema de Pagamentos

### Operador

- Dias úteis: €13,50/hora
- Domingo: €23,00/hora

### Supervisor

- Dias úteis: €15,00/hora
- Domingo: €25,00/hora

## 🔧 Scripts NPM

```bash
# Frontend
npm run dev              # Desenvolvimento local
npm run build            # Build produção
npm run preview          # Preview da build

# Docker
npm run docker:up        # Subir stack completa
npm run docker:down      # Parar containers
npm run docker:dev       # Modo desenvolvimento
npm run docker:build     # Rebuild imagens
npm run docker:logs      # Ver logs
npm run docker:restart   # Reiniciar containers
```

## 📦 Estrutura do Projeto

```
warehouse/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilitários e API
│   └── main.jsx            # Entry point
├── server/                 # Backend Node.js
│   ├── config/             # Configuração DB
│   ├── routes/             # Rotas da API
│   ├── database/           # Schema SQL
│   └── server.js           # Entry point
├── docker-compose.yml      # Orquestração Docker
├── Dockerfile              # Build frontend
└── server/Dockerfile       # Build backend
```

## 🔐 Login

O sistema possui autenticação JWT completa.

**Credenciais padrão:**

- **Usuário**: `admin`
- **Senha**: `admin123`

⚠️ **Importante**: Altere a senha após o primeiro login!

Ver `AUTH_SETUP.md` para setup completo.

## 📚 Documentação

- **`AUTH.md`** - Sistema de autenticação completo
- **`AUTH_SETUP.md`** - Setup rápido do login
- **`DOCKER.md`** - Guia completo do Docker e Docker Compose
- **`DATABASE.md`** - Estrutura e queries do PostgreSQL
- **`API.md`** - Documentação completa da API REST
- **`DEMO.md`** - Demonstração e funcionalidades

## 🗄️ Banco de Dados

### Credenciais (Development)

- **Host**: localhost
- **Port**: 5433
- **Database**: warehouse_db
- **User**: warehouse_user
- **Password**: warehouse_pass_2024

⚠️ **Altere em produção!**

### Tabelas

- `employees` - Funcionários
- `schedules` - Escalas de trabalho
- `payments` - Registro de pagamentos

Ver `DATABASE.md` para detalhes completos.

## 🔌 API Endpoints

### Employees

- `GET /api/employees` - Listar funcionários
- `POST /api/employees` - Criar funcionário
- `PUT /api/employees/:id` - Atualizar funcionário
- `DELETE /api/employees/:id` - Remover funcionário

### Schedules

- `GET /api/schedules` - Listar escalas
- `GET /api/schedules/week/:week_key` - Escalas da semana
- `POST /api/schedules` - Criar escala
- `DELETE /api/schedules/:id` - Remover escala

Ver `API.md` para documentação completa com exemplos.

## 🐛 Troubleshooting

### Erro de conexão com API

```bash
# Verificar se backend está rodando
curl http://localhost:5000/health

# Ver logs
docker-compose logs backend
```

### Erro de conexão com banco

```bash
# Ver logs do PostgreSQL
docker-compose logs postgres

# Reiniciar banco
docker-compose restart postgres
```

### Reset completo

```bash
# Parar tudo e limpar volumes
docker-compose down -v

# Subir novamente
docker-compose up -d
```

## 📦 Deploy

### Docker (Produção)

```bash
docker-compose up -d
```

### Heroku (Legacy)

O sistema ainda possui configuração para Heroku, mas recomendamos usar Docker.

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 📞 Suporte

Para questões e suporte, consulte a documentação em:

- `DOCKER.md` - Problemas com containers
- `DATABASE.md` - Questões do banco de dados
- `API.md` - Dúvidas sobre a API
