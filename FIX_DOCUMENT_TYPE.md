# 🔧 FIX: Document Type e Visa Expiry

## ❌ Problema Encontrado

O backend **NÃO estava salvando** os campos `document_type` e `visa_expiry`!

```javascript
// ANTES (ERRADO):
INSERT INTO employees (name, department, position, hire_date, hourly_rate, email, phone)
VALUES ($1, $2, $3, $4, $5, $6, $7)

// DEPOIS (CORRETO):
INSERT INTO employees (name, department, position, hire_date, hourly_rate, email, phone, document_type, visa_expiry)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
```

## ✅ Correções Aplicadas

### 1. Backend: `server/routes/employees.js`

- ✅ Adicionado `document_type` e `visa_expiry` na rota POST (criar)
- ✅ Adicionado validação para esses campos
- ✅ Adicionado na rota PUT (atualizar)
- ✅ Adicionado logs para debug

### 2. Frontend: `src/utils/api.js`

- ✅ Adicionado conversão `camelCase` → `snake_case`:
  - `documentType` → `document_type`
  - `visaExpiryDate` → `visa_expiry`
  - `birthDate` → `hire_date`
- ✅ Adicionado conversão `snake_case` → `camelCase` ao ler da API
- ✅ Adicionado logs detalhados

---

## 🚀 Aplicar Correção

```bash
# 1. Commit
git add .
git commit -m "fix: save document_type and visa_expiry fields"
git push

# 2. Redeploy no Portainer
Portainer → Pull and redeploy
```

---

## 🧪 TESTE COMPLETO

### ⚠️ IMPORTANTE: Funcionários Antigos

Os funcionários criados ANTES dessa correção **NÃO TÊM** `document_type` e `visa_expiry` salvos!

**Você precisa:**

1. **OPÇÃO A:** Deletar e recriar os funcionários ✅ (RECOMENDADO)
2. **OPÇÃO B:** Atualizar manualmente no DBeaver:

```sql
-- Ver quais funcionários NÃO têm document_type
SELECT id, name, document_type, visa_expiry
FROM employees;

-- Atualizar Bruno para Stamp2
UPDATE employees
SET document_type = 'Stamp2',
    visa_expiry = '2025-12-31'
WHERE name LIKE '%Bruno%';

-- Verificar
SELECT id, name, document_type, visa_expiry
FROM employees;
```

---

### 📋 Teste 1: Criar Novo Funcionário

**Console deve estar aberto (F12)!**

1. Ir para `/employees`
2. Clicar em "Add New Employee"
3. Preencher:
   - Name: `Test Stamp2`
   - Position: `Tester`
   - Document Type: `Stamp2`
   - Visa Expiry Date: `2025-12-31`
   - Email: `test@test.com`
4. Clicar em "Add Employee"

**No console deve aparecer:**

```
📤 CREATE Employee (camelCase): {
  name: "Test Stamp2",
  documentType: "Stamp2",
  visaExpiryDate: "2025-12-31",
  ...
}

📤 CREATE Employee (snake_case): {
  name: "Test Stamp2",
  document_type: "Stamp2",    <--- ✅ Convertido!
  visa_expiry: "2025-12-31",  <--- ✅ Convertido!
  ...
}
```

**No DBeaver verificar:**

```sql
SELECT id, name, document_type, visa_expiry
FROM employees
WHERE name = 'Test Stamp2';
```

Deve retornar:

```
id | name        | document_type | visa_expiry
---+-------------+---------------+-------------
X  | Test Stamp2 | Stamp2        | 2025-12-31
```

✅ **Se aparecer, está funcionando!**

---

### 📋 Teste 2: Validações Agora Funcionam

1. Limpar schedules antigos:

```sql
DELETE FROM schedules WHERE week_key = '2024-11-10';
```

2. Criar 3 schedules para "Test Stamp2":
   - **1ª:** Monday 8AM-5PM (8h) → ✅ Deve criar OK
   - **2ª:** Tuesday 8AM-5PM (8h) → ✅ Deve criar OK (16h total)
   - **3ª:** Wednesday 8AM-5PM (8h) → ⚠️ **DEVE ALERTAR!** (24h > 20h)

**No 3º schedule, console deve mostrar:**

```
🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍
🔍 DADOS DO FUNCIONÁRIO SELECIONADO:
🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍
ID: X
Funcionário encontrado: SIM
Nome: Test Stamp2
Document Type: Stamp2           <--- ✅ AGORA TEM!
É Stamp2? true                  <--- ✅ VERDADEIRO!
Visa Expiry: 2025-12-31         <--- ✅ TEM DATA!
🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍

⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰
⏰ VERIFICANDO LIMITE STAMP2
⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰
Tem funcionário? true
Document Type: Stamp2
É Stamp2? true
⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰

✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
✅ ENTROU NA VALIDAÇÃO STAMP2!
✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

📊 Cálculo de horas Stamp2: {
  currentHours: "16.00",
  newHours: "8.00",
  totalHours: "24.00",       <--- ✅ EXCEDEU!
  limit: 20,
  exceedsLimit: true         <--- ✅ TRUE!
}

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
⚠️ LIMITE STAMP2 EXCEDIDO!
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

🛑 PAUSADO - Stamp2 limite
```

🚨 **DEVE APARECER:**

1. ✅ Alert popup nativo
2. ✅ Modal de confirmação
3. ❌ NÃO cria automaticamente

---

### 📋 Teste 3: Visa Expirado

1. Criar funcionário com visa expirado:

   - Name: `Test Expired`
   - Document Type: `Stamp2`
   - Visa Expiry Date: `2024-01-01` (passado!)

2. Tentar criar schedule para esse funcionário

**Console deve mostrar:**

```
🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂
🛂 VISTO EXPIRADO!
🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂
Funcionário: Test Expired
Expirou: 1/1/2024
🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂

🛑 PAUSADO - Visto expirado
```

✅ Alert + Modal de confirmação

---

## 🐛 Troubleshooting

### Problema: "documentType: undefined" ainda aparece

**Causa:** Funcionário foi criado ANTES da correção.

**Solução:**

```sql
-- Ver funcionários sem document_type
SELECT id, name, document_type
FROM employees
WHERE document_type IS NULL;

-- Deletar e recriar esses funcionários
-- OU atualizar manualmente:
UPDATE employees
SET document_type = 'Stamp2',
    visa_expiry = '2025-12-31'
WHERE id = [ID];
```

### Problema: Conversão não está acontecendo

**Causa:** Cache do navegador.

**Solução:**

```
F12 → Application → Clear storage → Clear site data
Ctrl + Shift + R (refresh forçado)
```

---

## 📊 Checklist

Depois de redeploy:

- [ ] Limpou cache do navegador
- [ ] Console aberto (F12)
- [ ] Criou NOVO funcionário com Document Type e Visa
- [ ] Verificou no DBeaver que os campos foram salvos
- [ ] Testou validação de 20h (3 schedules de 8h)
- [ ] Testou validação de visa expirado
- [ ] Testou validação de conflito de horário

---

## 🎯 Resultado Esperado

Agora quando criar schedule, o console deve mostrar:

```
Document Type: Stamp2          ✅ (antes: undefined)
visaExpiryDate: 2025-12-31     ✅ (antes: undefined)
É Stamp2? true                 ✅ (antes: false)
```

E as validações vão funcionar! 🎉

---

**Teste agora e me mostre os logs do console!** 📸




