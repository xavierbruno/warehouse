# 🔄 Guia de Migração: localStorage → PostgreSQL

Este guia ajuda na migração dos dados existentes do localStorage do navegador para o banco de dados PostgreSQL.

## 📋 Pré-requisitos

1. Docker e Docker Compose instalados
2. Dados existentes no localStorage do navegador

## 🚀 Processo de Migração

### Passo 1: Exportar Dados do localStorage

Abra o Console do navegador (F12) na aplicação antiga e execute:

```javascript
// Exportar funcionários
const employees = JSON.parse(
  localStorage.getItem("warehouse-employees") || "[]"
);
console.log("=== EMPLOYEES ===");
console.log(JSON.stringify(employees, null, 2));

// Copie a saída acima e salve em um arquivo

// Exportar escalas
const schedules = JSON.parse(
  localStorage.getItem("warehouse-schedules") || "{}"
);
console.log("=== SCHEDULES ===");
console.log(JSON.stringify(schedules, null, 2));

// Copie a saída acima e salve em um arquivo
```

### Passo 2: Iniciar a Stack com PostgreSQL

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar se tudo está rodando
docker-compose ps

# Testar a API
curl http://localhost:5000/health
```

### Passo 3: Migrar Funcionários via API

Use os dados exportados para criar funcionários via API:

```bash
# Exemplo: Criar funcionário
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "department": "Warehouse",
    "position": "Operator",
    "hourly_rate": 25.50,
    "email": "joao@example.com",
    "phone": "(11) 98765-4321"
  }'
```

### Passo 4: Migrar Escalas via API

```bash
# Exemplo: Criar escala
curl -X POST http://localhost:5000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "week_key": "2024-45",
    "day_key": "monday",
    "start_time": "08:00",
    "end_time": "17:00",
    "break_minutes": 60
  }'
```

## 🤖 Script Automático de Migração

Crie um arquivo `migrate.js` na raiz do projeto:

```javascript
// migrate.js
const API_URL = "http://localhost:5000/api";

// Cole aqui os dados exportados do localStorage
const employees = [
  // ... dados exportados
];

const schedules = {
  // ... dados exportados
};

async function migrateEmployees() {
  const employeeMap = new Map(); // mapear IDs antigos para novos

  for (const emp of employees) {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: emp.name,
          department: emp.department || "Warehouse",
          position: emp.position || "Operator",
          hourly_rate: emp.hourlyRate || 0,
          email: emp.email,
          phone: emp.phone,
        }),
      });

      const newEmployee = await response.json();
      employeeMap.set(emp.id, newEmployee.id);
      console.log(
        `✅ Migrado: ${emp.name} (ID antigo: ${emp.id} → novo: ${newEmployee.id})`
      );
    } catch (error) {
      console.error(`❌ Erro ao migrar ${emp.name}:`, error);
    }
  }

  return employeeMap;
}

async function migrateSchedules(employeeMap) {
  for (const [weekKey, weekData] of Object.entries(schedules)) {
    for (const [dayKey, daySchedules] of Object.entries(weekData)) {
      for (const schedule of daySchedules) {
        try {
          const newEmployeeId = employeeMap.get(schedule.employeeId);

          if (!newEmployeeId) {
            console.warn(
              `⚠️  Funcionário não encontrado para escala: ${schedule.employeeId}`
            );
            continue;
          }

          await fetch(`${API_URL}/schedules`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              employee_id: newEmployeeId,
              week_key: weekKey,
              day_key: dayKey,
              start_time: schedule.startTime,
              end_time: schedule.endTime,
              break_minutes: schedule.breakMinutes || 0,
              notes: schedule.notes,
            }),
          });

          console.log(
            `✅ Escala migrada: ${weekKey}/${dayKey} - Employee ${newEmployeeId}`
          );
        } catch (error) {
          console.error(`❌ Erro ao migrar escala:`, error);
        }
      }
    }
  }
}

async function migrate() {
  console.log("🚀 Iniciando migração...\n");

  console.log("📊 Migrando funcionários...");
  const employeeMap = await migrateEmployees();

  console.log("\n📅 Migrando escalas...");
  await migrateSchedules(employeeMap);

  console.log("\n✅ Migração concluída!");
}

migrate().catch(console.error);
```

Execute o script:

```bash
node migrate.js
```

## 🔍 Verificar Migração

### Via API

```bash
# Listar todos os funcionários
curl http://localhost:5000/api/employees

# Listar todas as escalas
curl http://localhost:5000/api/schedules

# Listar escalas de uma semana específica
curl http://localhost:5000/api/schedules/week/2024-45
```

### Via PostgreSQL

```bash
# Acessar o banco
docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db

# Contar funcionários
SELECT COUNT(*) FROM employees;

# Contar escalas
SELECT COUNT(*) FROM schedules;

# Ver dados
SELECT * FROM employees LIMIT 5;
SELECT * FROM schedules LIMIT 5;

# Sair
\q
```

### Via Frontend

Abra http://localhost:3333 e verifique se:

- Todos os funcionários aparecem na lista
- As escalas estão corretas
- Você consegue criar novos registros

## 🧹 Limpeza (Opcional)

Após confirmar que a migração foi bem-sucedida:

```javascript
// No console do navegador (F12)
localStorage.removeItem("warehouse-employees");
localStorage.removeItem("warehouse-schedules");
console.log("✅ localStorage limpo!");
```

## 🔄 Rollback

Se algo der errado, você pode reverter:

```bash
# Parar containers e remover dados
docker-compose down -v

# Subir novamente (banco limpo)
docker-compose up -d

# Seus dados no localStorage ainda estarão seguros
```

## 📝 Notas Importantes

1. **Backup**: Antes de limpar o localStorage, faça um backup completo dos dados exportados
2. **IDs**: Os IDs no PostgreSQL serão diferentes dos IDs do localStorage
3. **Validação**: A API valida os dados - alguns campos podem ser obrigatórios
4. **Gradual**: Você pode fazer a migração gradualmente, mantendo ambos sistemas rodando

## 🆘 Troubleshooting

### Erro "employee not found"

- Certifique-se de migrar os funcionários antes das escalas
- Verifique se os IDs foram mapeados corretamente

### Erro de validação

- Verifique se todos os campos obrigatórios estão presentes
- Confira o formato de datas e horários

### API não responde

```bash
# Verificar status
docker-compose ps

# Ver logs
docker-compose logs backend

# Reiniciar
docker-compose restart backend
```

## 📞 Suporte

Para dúvidas sobre:

- Estrutura de dados: ver `DATABASE.md`
- API endpoints: ver `API.md`
- Docker: ver `DOCKER.md`
