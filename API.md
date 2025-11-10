# 📡 Documentação da API

API REST para o Sistema de Controle de Escala Warehouse.

**Base URL**: `http://localhost:5000/api`

## 📋 Índice

- [Health Check](#health-check)
- [Employees](#employees)
- [Schedules](#schedules)

---

## Health Check

### GET /health

Verifica o status da API e conexão com banco de dados.

**Resposta de sucesso:**

```json
{
  "status": "ok",
  "timestamp": "2024-11-10T10:30:00.000Z",
  "database": "connected"
}
```

---

## Employees

### GET /api/employees

Lista todos os funcionários ativos.

**Resposta:**

```json
[
  {
    "id": 1,
    "name": "João Silva",
    "department": "Warehouse",
    "position": "Operator",
    "hire_date": "2023-01-15",
    "hourly_rate": 25.5,
    "email": "joao.silva@example.com",
    "phone": "(11) 98765-4321",
    "status": "active",
    "created_at": "2024-11-10T10:00:00.000Z",
    "updated_at": "2024-11-10T10:00:00.000Z"
  }
]
```

### GET /api/employees/:id

Busca um funcionário específico por ID.

**Parâmetros:**

- `id` (number) - ID do funcionário

**Resposta:**

```json
{
  "id": 1,
  "name": "João Silva",
  "department": "Warehouse",
  "position": "Operator",
  "hire_date": "2023-01-15",
  "hourly_rate": 25.5,
  "email": "joao.silva@example.com",
  "phone": "(11) 98765-4321",
  "status": "active",
  "created_at": "2024-11-10T10:00:00.000Z",
  "updated_at": "2024-11-10T10:00:00.000Z"
}
```

### POST /api/employees

Cria um novo funcionário.

**Body:**

```json
{
  "name": "Maria Santos",
  "department": "Warehouse",
  "position": "Supervisor",
  "hire_date": "2024-01-15",
  "hourly_rate": 32.0,
  "email": "maria.santos@example.com",
  "phone": "(11) 98765-4322"
}
```

**Validações:**

- `name` (obrigatório) - Nome do funcionário
- `department` (opcional) - Departamento
- `position` (opcional) - Cargo
- `hire_date` (opcional) - Data de contratação (ISO 8601)
- `hourly_rate` (opcional) - Taxa por hora (número >= 0)
- `email` (opcional) - Email válido
- `phone` (opcional) - Telefone

**Resposta (201):**

```json
{
  "id": 2,
  "name": "Maria Santos",
  "department": "Warehouse",
  "position": "Supervisor",
  "hire_date": "2024-01-15",
  "hourly_rate": 32.0,
  "email": "maria.santos@example.com",
  "phone": "(11) 98765-4322",
  "status": "active",
  "created_at": "2024-11-10T10:00:00.000Z",
  "updated_at": "2024-11-10T10:00:00.000Z"
}
```

### PUT /api/employees/:id

Atualiza um funcionário existente.

**Parâmetros:**

- `id` (number) - ID do funcionário

**Body (todos os campos opcionais):**

```json
{
  "name": "Maria Santos Silva",
  "position": "Senior Supervisor",
  "hourly_rate": 35.0
}
```

**Resposta:**

```json
{
  "id": 2,
  "name": "Maria Santos Silva",
  "department": "Warehouse",
  "position": "Senior Supervisor",
  "hire_date": "2024-01-15",
  "hourly_rate": 35.0,
  "email": "maria.santos@example.com",
  "phone": "(11) 98765-4322",
  "status": "active",
  "created_at": "2024-11-10T10:00:00.000Z",
  "updated_at": "2024-11-10T11:00:00.000Z"
}
```

### DELETE /api/employees/:id

Remove um funcionário (soft delete - marca como inativo).

**Parâmetros:**

- `id` (number) - ID do funcionário

**Resposta:**

```json
{
  "message": "Funcionário removido com sucesso",
  "employee": {
    "id": 2,
    "name": "Maria Santos Silva",
    "status": "inactive",
    ...
  }
}
```

---

## Schedules

### GET /api/schedules

Lista todas as escalas com filtros opcionais.

**Query Parameters (opcionais):**

- `week_key` (string) - Filtrar por semana (ex: "2024-45")
- `day_key` (string) - Filtrar por dia
- `employee_id` (number) - Filtrar por funcionário

**Exemplo:**

```
GET /api/schedules?week_key=2024-45&day_key=monday
```

**Resposta:**

```json
[
  {
    "id": 1,
    "employee_id": 1,
    "week_key": "2024-45",
    "day_key": "monday",
    "start_time": "08:00:00",
    "end_time": "17:00:00",
    "break_minutes": 60,
    "notes": "Turno normal",
    "employee_name": "João Silva",
    "department": "Warehouse",
    "position": "Operator",
    "created_at": "2024-11-10T10:00:00.000Z",
    "updated_at": "2024-11-10T10:00:00.000Z"
  }
]
```

### GET /api/schedules/week/:week_key

Busca todas as escalas de uma semana específica, agrupadas por dia.

**Parâmetros:**

- `week_key` (string) - Chave da semana (ex: "2024-45")

**Resposta:**

```json
{
  "monday": [
    {
      "id": 1,
      "employee_id": 1,
      "week_key": "2024-45",
      "day_key": "monday",
      "start_time": "08:00:00",
      "end_time": "17:00:00",
      "break_minutes": 60,
      "employee_name": "João Silva",
      "department": "Warehouse",
      "position": "Operator",
      "hourly_rate": 25.50
    }
  ],
  "tuesday": [...]
}
```

### GET /api/schedules/:id

Busca uma escala específica por ID.

**Parâmetros:**

- `id` (number) - ID da escala

**Resposta:**

```json
{
  "id": 1,
  "employee_id": 1,
  "week_key": "2024-45",
  "day_key": "monday",
  "start_time": "08:00:00",
  "end_time": "17:00:00",
  "break_minutes": 60,
  "notes": "Turno normal",
  "employee_name": "João Silva",
  "department": "Warehouse",
  "position": "Operator",
  "created_at": "2024-11-10T10:00:00.000Z",
  "updated_at": "2024-11-10T10:00:00.000Z"
}
```

### POST /api/schedules

Cria uma nova escala.

**Body:**

```json
{
  "employee_id": 1,
  "week_key": "2024-45",
  "day_key": "monday",
  "start_time": "08:00",
  "end_time": "17:00",
  "break_minutes": 60,
  "notes": "Turno normal"
}
```

**Validações:**

- `employee_id` (obrigatório) - ID do funcionário (número inteiro)
- `week_key` (obrigatório) - Chave da semana
- `day_key` (obrigatório) - Chave do dia
- `start_time` (obrigatório) - Horário inicial (formato: HH:MM)
- `end_time` (obrigatório) - Horário final (formato: HH:MM)
- `break_minutes` (opcional) - Minutos de intervalo (padrão: 0)
- `notes` (opcional) - Observações

**Resposta (201):**

```json
{
  "id": 1,
  "employee_id": 1,
  "week_key": "2024-45",
  "day_key": "monday",
  "start_time": "08:00:00",
  "end_time": "17:00:00",
  "break_minutes": 60,
  "notes": "Turno normal",
  "created_at": "2024-11-10T10:00:00.000Z",
  "updated_at": "2024-11-10T10:00:00.000Z"
}
```

### PUT /api/schedules/:id

Atualiza uma escala existente.

**Parâmetros:**

- `id` (number) - ID da escala

**Body (todos os campos opcionais):**

```json
{
  "start_time": "09:00",
  "end_time": "18:00",
  "break_minutes": 45
}
```

**Resposta:**

```json
{
  "id": 1,
  "employee_id": 1,
  "week_key": "2024-45",
  "day_key": "monday",
  "start_time": "09:00:00",
  "end_time": "18:00:00",
  "break_minutes": 45,
  "notes": "Turno normal",
  "created_at": "2024-11-10T10:00:00.000Z",
  "updated_at": "2024-11-10T11:00:00.000Z"
}
```

### DELETE /api/schedules/:id

Remove uma escala.

**Parâmetros:**

- `id` (number) - ID da escala

**Resposta:**

```json
{
  "message": "Escala removida com sucesso",
  "schedule": {
    "id": 1,
    ...
  }
}
```

---

## 🔧 Exemplos de Uso

### JavaScript/Fetch

```javascript
// Listar funcionários
const response = await fetch("http://localhost:5000/api/employees");
const employees = await response.json();

// Criar funcionário
const newEmployee = await fetch("http://localhost:5000/api/employees", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Pedro Costa",
    department: "Logistics",
    hourly_rate: 28.75,
  }),
});

// Criar escala
const newSchedule = await fetch("http://localhost:5000/api/schedules", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    employee_id: 1,
    week_key: "2024-45",
    day_key: "monday",
    start_time: "08:00",
    end_time: "17:00",
    break_minutes: 60,
  }),
});
```

### cURL

```bash
# Listar funcionários
curl http://localhost:5000/api/employees

# Criar funcionário
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Pedro Costa","department":"Logistics","hourly_rate":28.75}'

# Buscar escalas da semana
curl http://localhost:5000/api/schedules/week/2024-45
```

---

## ⚠️ Códigos de Erro

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Requisição inválida (erro de validação)
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

**Formato de erro:**

```json
{
  "error": "Mensagem de erro descritiva"
}
```

**Erros de validação:**

```json
{
  "errors": [
    {
      "msg": "Nome é obrigatório",
      "param": "name",
      "location": "body"
    }
  ]
}
```
