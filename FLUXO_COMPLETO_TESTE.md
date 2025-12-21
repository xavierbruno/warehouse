# 🎯 Fluxo Completo de Teste - Via DBeaver

## 📋 Objetivo

Testar **TODO** o fluxo do sistema:

1. ✅ Criar funcionários
2. ✅ Criar escalas (várias semanas)
3. ✅ Calcular pagamentos
4. ✅ Gerar PDF
5. ✅ Editar dados
6. ✅ Remover dados
7. ✅ Ver histórico

## 🚀 Execute no DBeaver

### Conectar ao Banco

```
postgres 213.199.59.34:5434
Database: warehouse_db
```

### Passo 1: Executar Script Completo

Abra o arquivo **`CRUD_COMPLETO.sql`** e execute **tudo de uma vez** (Ctrl+Enter).

Isso vai criar:

- ✅ 5 funcionários (Operators e Supervisors)
- ✅ 17 escalas na semana atual (2024-45)
- ✅ 7 escalas na semana passada (2024-44)
- ✅ 4 escalas 2 semanas atrás (2024-43)

## 📊 O Que o Script Faz

### 1. CREATE (Criar)

```sql
-- 5 funcionários
-- 28 escalas em 3 semanas diferentes
-- Dados completos para teste
```

### 2. READ (Consultar)

```sql
-- Listar funcionários
-- Ver escalas por semana
-- Calcular pagamentos
-- Gerar dados para PDF
```

### 3. UPDATE (Atualizar)

```sql
-- Alterar taxa de funcionário
-- Modificar horários de escalas
-- Atualizar cargos
```

### 4. DELETE (Remover)

```sql
-- Soft delete de funcionários
-- Remover escalas específicas
```

## 🎯 Testar no Sistema Web

Após executar o script SQL:

### 1. Acessar Sistema

```
http://213.199.59.34:3333
Login: admin / admin123
```

### 2. Ver Funcionários

```
/employees

Deve mostrar:
- João Silva (Operator)
- Maria Santos (Operator)
- Pedro Costa (Operator)
- Roberto Lima (Supervisor)
- Juliana Martins (Supervisor)
```

### 3. Ver Escalas

```
/schedule

Selecione semana: 2024-45 (atual)
Deve mostrar escalas de segunda a domingo
```

### 4. Calcular Pagamentos

```
/payments

Selecione semana: 2024-45
Deve calcular automaticamente:
- Horas de cada funcionário
- Valor a pagar
- Diferença dias úteis/domingo
```

### 5. Exportar PDF

```
Clique em "Export PDF" ou "Download PDF"
PDF com:
- Logo GLS
- Tabela de escalas
- Resumo de pagamentos
```

### 6. Testar Histórico

```
/schedule

Navegue entre semanas:
- 2024-45 (atual) - 17 escalas
- 2024-44 (anterior) - 7 escalas
- 2024-43 (2 semanas atrás) - 4 escalas
```

## 🧪 Testes de CRUD via Web

### Criar Novo Funcionário

1. `/employees` → "Add New Employee"
2. Nome: "Carlos Novo"
3. Position: "Operator"
4. Salvar
5. **Verificar no banco:**

```sql
SELECT * FROM employees WHERE name = 'Carlos Novo';
```

### Editar Funcionário

1. Editar "João Silva"
2. Mudar taxa para 14.00
3. Salvar
4. **Verificar:**

```sql
SELECT name, hourly_rate, updated_at
FROM employees
WHERE name = 'João Silva';
```

### Criar Nova Escala

1. `/schedule` → Semana 2024-45
2. Dia: Monday
3. Funcionário: Carlos Novo
4. Horário: 08:00 - 17:00
5. Salvar
6. **Verificar:**

```sql
SELECT * FROM schedules
WHERE week_key = '2024-45' AND day_key = 'monday'
ORDER BY created_at DESC LIMIT 1;
```

### Remover Escala

1. Clique no "X" em uma escala
2. Confirme
3. **Verificar:**

```sql
-- Escala deve ter sido deletada
SELECT COUNT(*) FROM schedules WHERE week_key = '2024-45';
```

## 📈 Queries de Verificação

### Após Executar o Script

```sql
-- Total de funcionários
SELECT COUNT(*) as total,
       SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as ativos
FROM employees;

-- Total de escalas por semana
SELECT week_key, COUNT(*) as total
FROM schedules
GROUP BY week_key
ORDER BY week_key DESC;

-- Verificar se dados estão corretos
SELECT
    (SELECT COUNT(*) FROM employees) as total_employees,
    (SELECT COUNT(*) FROM schedules) as total_schedules,
    (SELECT COUNT(*) FROM users) as total_users;
```

### Calcular Pagamento Total

```sql
-- Quanto vai custar a semana 2024-45
SELECT
    ROUND(CAST(SUM(
        CASE
            WHEN e.position = 'Operator' AND s.day_key != 'sunday' THEN
                (EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600 - (s.break_minutes / 60.0)) * 13.50
            WHEN e.position = 'Operator' AND s.day_key = 'sunday' THEN
                (EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600 - (s.break_minutes / 60.0)) * 23.00
            WHEN e.position = 'Supervisor' AND s.day_key != 'sunday' THEN
                (EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600 - (s.break_minutes / 60.0)) * 15.00
            WHEN e.position = 'Supervisor' AND s.day_key = 'sunday' THEN
                (EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600 - (s.break_minutes / 60.0)) * 25.00
        END
    ) AS NUMERIC), 2) as custo_total_semana
FROM schedules s
JOIN employees e ON s.employee_id = e.id
WHERE s.week_key = '2024-45';
```

## ✅ Checklist de Teste

### Dados Iniciais

- [ ] Script CRUD_COMPLETO.sql executado
- [ ] 5 funcionários criados
- [ ] 28 escalas criadas (3 semanas)
- [ ] Dados verificados no banco

### Teste Web

- [ ] Login funcionando
- [ ] Funcionários aparecem em /employees
- [ ] Escalas aparecem em /schedule
- [ ] Pode navegar entre semanas
- [ ] Pagamentos calculam corretamente
- [ ] PDF pode ser exportado

### Teste CRUD

- [ ] Criar novo funcionário via web
- [ ] Editar funcionário existente
- [ ] Deletar funcionário
- [ ] Criar nova escala via web
- [ ] Remover escala via web
- [ ] Mudanças persistem no banco

### Histórico

- [ ] Ver semanas anteriores
- [ ] Ver última atualização
- [ ] Ver audit trail (created_at, updated_at)

## 🎉 Resultado Esperado

Após executar o script, o sistema estará **100% funcional** com:

- ✅ **5 funcionários** de exemplo
- ✅ **3 semanas** de histórico
- ✅ **28 escalas** completas
- ✅ **Cálculos** de pagamento funcionando
- ✅ **PDF** pode ser gerado
- ✅ **CRUD** completo via web

## 📝 Arquivo Criado

**`CRUD_COMPLETO.sql`** - Script com:

- ✅ 300+ linhas de SQL
- ✅ CREATE de dados de teste
- ✅ READ com queries complexas
- ✅ UPDATE de exemplos
- ✅ DELETE de exemplos
- ✅ Queries para PDF
- ✅ Histórico e auditoria
- ✅ Estatísticas e relatórios

**Execute e teste todo o sistema!** 🚀




