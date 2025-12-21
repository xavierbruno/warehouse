# ✅ Correção: Criação de Funcionários

## Problema

Ao tentar criar um funcionário, o sistema retornava erro:
```
Erro ao criar funcionário: error: column "document_type" of relation "employees" does not exist
```

## Causa

A tabela `employees` não tinha as colunas que o frontend estava tentando enviar:
- `document_type`
- `visa_expiry`
- `birth_date`

Além disso, havia um erro de mapeamento no frontend onde `birthDate` estava sendo convertido incorretamente para `hire_date` em vez de `birth_date`.

## Solução Aplicada

### 1. Adicionadas colunas ao banco de dados

```sql
ALTER TABLE employees 
  ADD COLUMN IF NOT EXISTS document_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS visa_expiry DATE,
  ADD COLUMN IF NOT EXISTS birth_date DATE;
```

### 2. Atualizado `init.sql`

O arquivo `server/database/init.sql` foi atualizado para incluir essas colunas em futuras instalações.

### 3. Corrigido mapeamento no frontend

**Arquivo:** `src/utils/api.js`

- ✅ `birthDate` agora é corretamente convertido para `birth_date` (antes era `hire_date`)
- ✅ `birth_date` é corretamente convertido de volta para `birthDate` ao receber da API

### 4. Atualizado backend

**Arquivo:** `server/routes/employees.js`

- ✅ Rota POST agora aceita e insere `birth_date`
- ✅ Validação adicionada para `birth_date` na rota POST
- ✅ Rota PUT também atualizada para incluir `birth_date`

## Teste

1. Acesse http://localhost:3333/employees
2. Clique em "Add Employee"
3. Preencha os campos:
   - Full Name: Bruno Vasconcelos Xavier
   - Position: Operator
   - Phone: +5521997064277
   - Email: brunovx6@gmail.com
   - Birth Date: 09/12/2025
   - Document Type: Stamp2
   - Visa Expiry Date: 10/01/2026
4. Clique em "Add Employee"

O funcionário deve ser criado com sucesso! ✅

## Verificar no banco

```bash
docker exec warehouse-postgres psql -U warehouse_user -d warehouse_db -c "SELECT id, name, document_type, visa_expiry, birth_date FROM employees;"
```

