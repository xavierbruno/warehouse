# 🗄️ Configuração do Banco de Dados PostgreSQL

Este documento descreve a estrutura do banco de dados e como trabalhar com ele.

## 📊 Estrutura do Banco de Dados

### Tabela: `employees`

Armazena informações dos funcionários do warehouse.

| Campo       | Tipo          | Descrição                         |
| ----------- | ------------- | --------------------------------- |
| id          | SERIAL        | ID único (gerado automaticamente) |
| name        | VARCHAR(255)  | Nome do funcionário               |
| department  | VARCHAR(100)  | Departamento                      |
| position    | VARCHAR(100)  | Cargo/Posição                     |
| hire_date   | DATE          | Data de contratação               |
| hourly_rate | DECIMAL(10,2) | Taxa por hora                     |
| email       | VARCHAR(255)  | Email                             |
| phone       | VARCHAR(20)   | Telefone                          |
| status      | VARCHAR(20)   | Status (active/inactive)          |
| created_at  | TIMESTAMP     | Data de criação                   |
| updated_at  | TIMESTAMP     | Data da última atualização        |

### Tabela: `schedules`

Armazena as escalas de trabalho dos funcionários.

| Campo         | Tipo        | Descrição                          |
| ------------- | ----------- | ---------------------------------- |
| id            | SERIAL      | ID único (gerado automaticamente)  |
| employee_id   | INTEGER     | ID do funcionário (FK)             |
| week_key      | VARCHAR(50) | Chave da semana (formato: YYYY-WW) |
| day_key       | VARCHAR(20) | Chave do dia                       |
| start_time    | TIME        | Horário de início                  |
| end_time      | TIME        | Horário de término                 |
| break_minutes | INTEGER     | Minutos de intervalo               |
| notes         | TEXT        | Observações                        |
| created_at    | TIMESTAMP   | Data de criação                    |
| updated_at    | TIMESTAMP   | Data da última atualização         |

### Tabela: `payments`

Armazena informações de pagamentos (para tracking futuro).

| Campo        | Tipo          | Descrição                         |
| ------------ | ------------- | --------------------------------- |
| id           | SERIAL        | ID único (gerado automaticamente) |
| employee_id  | INTEGER       | ID do funcionário (FK)            |
| week_key     | VARCHAR(50)   | Chave da semana                   |
| total_hours  | DECIMAL(10,2) | Total de horas trabalhadas        |
| hourly_rate  | DECIMAL(10,2) | Taxa por hora                     |
| total_amount | DECIMAL(10,2) | Valor total                       |
| payment_date | DATE          | Data do pagamento                 |
| status       | VARCHAR(20)   | Status (pending/paid)             |
| notes        | TEXT          | Observações                       |
| created_at   | TIMESTAMP     | Data de criação                   |
| updated_at   | TIMESTAMP     | Data da última atualização        |

## 🔧 Gerenciamento do Banco

### Acessar o PostgreSQL via Docker

```bash
# Entrar no container do PostgreSQL
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db
```

### Comandos Úteis no psql

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d employees
\d schedules
\d payments

-- Ver todos os funcionários
SELECT * FROM employees;

-- Ver todas as escalas
SELECT * FROM schedules;

-- Ver escalas com nome do funcionário
SELECT s.*, e.name, e.department
FROM schedules s
JOIN employees e ON s.employee_id = e.id;

-- Limpar todas as escalas
TRUNCATE TABLE schedules CASCADE;

-- Limpar todos os funcionários (cuidado!)
TRUNCATE TABLE employees CASCADE;

-- Sair do psql
\q
```

### Backup do Banco de Dados

```bash
# Criar backup
docker exec -t warehouse-postgres pg_dump -U warehouse_user warehouse_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
cat backup.sql | docker exec -i warehouse-postgres psql -U warehouse_user -d warehouse_db
```

### Resetar o Banco de Dados

```bash
# Parar os containers
docker-compose down

# Remover o volume do banco
docker volume rm warehouse_postgres_data

# Subir novamente (vai recriar o banco)
docker-compose up -d
```

## 🔍 Queries Úteis

### Relatório de Horas por Funcionário

```sql
SELECT
    e.name,
    e.department,
    s.week_key,
    COUNT(*) as total_shifts,
    SUM(
        EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600 -
        (s.break_minutes / 60.0)
    ) as total_hours
FROM schedules s
JOIN employees e ON s.employee_id = e.id
GROUP BY e.id, e.name, e.department, s.week_key
ORDER BY s.week_key DESC, e.name;
```

### Funcionários sem Escalas

```sql
SELECT e.*
FROM employees e
LEFT JOIN schedules s ON e.id = s.employee_id
WHERE s.id IS NULL AND e.status = 'active';
```

### Escalas da Semana Atual

```sql
SELECT
    e.name,
    s.day_key,
    s.start_time,
    s.end_time,
    s.break_minutes
FROM schedules s
JOIN employees e ON s.employee_id = e.id
WHERE s.week_key = TO_CHAR(CURRENT_DATE, 'IYYY-IW')
ORDER BY s.day_key, s.start_time;
```

## 📝 Migração de Dados

### Importar dados do localStorage para PostgreSQL

Se você tem dados no localStorage do navegador e quer migrá-los para o banco:

1. Abra o navegador e acesse o Console (F12)
2. Execute:

```javascript
// Exportar funcionários
const employees = JSON.parse(
  localStorage.getItem("warehouse-employees") || "[]"
);
console.log(JSON.stringify(employees, null, 2));

// Exportar escalas
const schedules = JSON.parse(
  localStorage.getItem("warehouse-schedules") || "{}"
);
console.log(JSON.stringify(schedules, null, 2));
```

3. Use a API para importar os dados ou crie um script SQL

## 🔐 Credenciais (Development)

- **Host**: localhost
- **Port**: 5432
- **Database**: warehouse_db
- **User**: warehouse_user
- **Password**: warehouse_pass_2024

⚠️ **IMPORTANTE**: Altere estas credenciais em produção!

## 🚨 Troubleshooting

### Erro: "connection refused"

```bash
# Verificar se o container está rodando
docker ps | grep postgres

# Ver logs do PostgreSQL
docker logs warehouse-postgres

# Reiniciar container
docker-compose restart postgres
```

### Erro: "database does not exist"

```bash
# Recriar o banco
docker-compose down
docker volume rm warehouse_postgres_data
docker-compose up -d
```

### Performance lenta

```sql
-- Reindexar tabelas
REINDEX TABLE employees;
REINDEX TABLE schedules;

-- Analisar queries lentas
EXPLAIN ANALYZE SELECT * FROM schedules WHERE week_key = '2024-45';
```
