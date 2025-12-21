# 🐛 DEBUG STAMP2 - Validação de 20h

## 🚀 Aplicar e Testar

### 1. Deploy

```bash
git add .
git commit -m "debug: add detailed logs for Stamp2 validation"
git push
```

**Portainer:** Pull and redeploy

### 2. Limpar Cache

```
F12 → Application → Clear storage → Clear site data
Ctrl + Shift + R (refresh forçado)
```

### 3. Abrir Console ANTES de Testar

**IMPORTANTE:** Abra o console (F12) ANTES de clicar em "Add to Schedule"!

---

## 🧪 Teste Completo

### PASSO 1: Verificar Funcionário no BD

Abra DBeaver e execute:

```sql
-- Ver todos os funcionários
SELECT id, name, document_type, visa_expiry
FROM employees
ORDER BY id;
```

**Anote:**

- ID do funcionário Stamp2
- Nome exato
- Valor do campo `document_type`

### PASSO 2: Criar Schedules

**Console deve estar aberto (F12)!**

#### Teste A: Primeira Escala (8h)

```
Employee: [Funcionário Stamp2]
Day: Monday
Time: 8:00 AM - 5:00 PM (8h)
Clicar: Add to Schedule
```

**O que deve aparecer no console:**

```
================================================================================
🚀 INICIANDO CRIAÇÃO DE SCHEDULE
================================================================================
Dados do formulário: {...}

✅ VALIDAÇÃO 1: Sem conflitos

🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍
🔍 DADOS DO FUNCIONÁRIO SELECIONADO:
🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍
ID: 1
Funcionário encontrado: SIM
Nome: [Nome do funcionário]
Document Type: Stamp2    <--- TEM QUE SER EXATAMENTE "Stamp2"
Document Type (JSON): "Stamp2"
É Stamp2? true           <--- TEM QUE SER true
Visa Expiry: 2025-12-31
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
🔍 Verificando limite de 20h para Stamp2: [Nome]

📊 Cálculo de horas Stamp2: {
  currentHours: "0.00",
  newHours: "8.00",
  totalHours: "8.00",
  limit: 20,
  exceedsLimit: false
}

✅ VALIDAÇÃO 3: Stamp2 OK (8.00h)
```

✅ **Primeira escala OK (8h < 20h)**

---

#### Teste B: Segunda Escala (8h)

```
Employee: [Mesmo Stamp2]
Day: Tuesday
Time: 8:00 AM - 5:00 PM (8h)
Clicar: Add to Schedule
```

**Console deve mostrar:**

```
📊 Cálculo de horas Stamp2: {
  currentHours: "8.00",     <--- Escala de Monday
  newHours: "8.00",         <--- Nova escala
  totalHours: "16.00",      <--- Soma
  limit: 20,
  exceedsLimit: false       <--- Ainda OK
}

✅ VALIDAÇÃO 3: Stamp2 OK (16.00h)
```

✅ **Segunda escala OK (16h < 20h)**

---

#### Teste C: Terceira Escala (8h) - DEVE ALERTAR! ⚠️

```
Employee: [Mesmo Stamp2]
Day: Wednesday
Time: 8:00 AM - 5:00 PM (8h)
Clicar: Add to Schedule
```

**Console DEVE mostrar:**

```
📊 Cálculo de horas Stamp2: {
  currentHours: "16.00",    <--- 2 escalas anteriores
  newHours: "8.00",         <--- Nova escala
  totalHours: "24.00",      <--- Soma = 24h!
  limit: 20,
  exceedsLimit: true        <--- ⚠️ EXCEDEU!
}

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
⚠️ LIMITE STAMP2 EXCEDIDO!
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
Funcionário: [Nome]
Total: 24.00h / 20h
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

🛑 PAUSADO - Stamp2 limite
```

🚨 **DEVE APARECER:**

1. ✅ Alert popup do navegador
2. ✅ Modal de confirmação
3. ❌ NÃO deve criar automaticamente

---

## 🐛 Se NÃO Aparecer o Alerta

### Problema 1: Document Type Incorreto

Se aparecer no console:

```
⚠️ NÃO VALIDOU STAMP2:
  ℹ️ Não é Stamp2 (é: stamp2)   <--- Note o "s" minúsculo!
```

**Solução:** O campo está com valor incorreto no BD!

```sql
-- Verificar valores únicos
SELECT DISTINCT document_type FROM employees;

-- Se aparecer "stamp2" (minúsculo) ou com espaços, corrigir:
UPDATE employees
SET document_type = 'Stamp2'
WHERE LOWER(document_type) = 'stamp2';
```

### Problema 2: Funcionário Não Encontrado

Se aparecer:

```
🔍 DADOS DO FUNCIONÁRIO SELECIONADO:
Funcionário encontrado: NÃO        <--- ❌
```

**Solução:** O ID não existe ou está incorreto!

```sql
-- Verificar IDs
SELECT id, name FROM employees;
```

Use o ID correto no formulário.

### Problema 3: Cálculo de Horas Errado

Se aparecer:

```
📊 Cálculo de horas Stamp2: {
  currentHours: "0.00",      <--- ❌ Deveria ser 16.00
  newHours: "8.00",
  totalHours: "8.00",        <--- ❌ Deveria ser 24.00
  exceedsLimit: false        <--- ❌ Deveria ser true
}
```

**Solução:** As escalas anteriores não estão sendo contadas!

Verifique no BD:

```sql
SELECT * FROM schedules
WHERE employee_id = [ID]
  AND week_key = '2024-11-10';
```

Se não houver registros, as escalas anteriores não foram salvas!

---

## 📸 Me Envie

Se o problema persistir, me envie:

1. **Print do console** completo (copiar TODO o texto)
2. **Resultado do SQL:**
   ```sql
   SELECT id, name, document_type FROM employees WHERE id = [ID];
   ```
3. **Resultado do SQL:**
   ```sql
   SELECT * FROM schedules
   WHERE employee_id = [ID]
     AND week_key = '2024-11-10';
   ```
4. **Qual navegador** está usando?

---

## ✅ Checklist

Antes de testar:

- [ ] Fez redeploy
- [ ] Limpou cache (F12 → Application → Clear storage)
- [ ] Refresh forçado (Ctrl + Shift + R)
- [ ] Console aberto ANTES de clicar
- [ ] Verificou `document_type` no BD (deve ser "Stamp2" exato)
- [ ] Testou na ordem: 1ª escala → 2ª escala → 3ª escala (deve alertar)

**Teste agora e me mostre os logs do console! 🚀**




