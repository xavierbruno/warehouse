# 🧪 TESTE OS ALERTAS AGORA

## ⚡ Aplicar Fix

```bash
# 1. Commit
git add .
git commit -m "fix: add native alerts for validation"
git push

# 2. Redeploy
Portainer → Pull and redeploy

# 3. LIMPAR CACHE + DADOS
Ctrl + Shift + Delete → Selecionar TUDO
OU
F12 → Application → Clear storage → Clear site data

# 4. Refresh FORÇADO
Ctrl + Shift + R
```

## 🧪 Testes para Fazer

### ⚠️ IMPORTANTE: Limpar Dados Antigos Primeiro!

Execute no DBeaver:
```sql
-- Limpar escalas antigas (com conflitos)
DELETE FROM schedules WHERE week_key = '2024-11-10';

-- Verificar
SELECT * FROM schedules;
```

### Teste 1: Conflito de Horários ❌

```
1. Criar schedule:
   - Employee: Bruno Vasconcelos Xavier
   - Day: Tuesday
   - Time: 6:00 PM - 3:00 AM
   - Clicar: Add to Schedule
   ✅ Deve criar normalmente

2. Tentar criar NOVAMENTE:
   - Employee: Bruno Vasconcelos Xavier (MESMO!)
   - Day: Tuesday (MESMO DIA!)
   - Time: 7:00 PM - 3:00 AM (CONFLITA!)
   - Clicar: Add to Schedule
   
   ✅ DEVE APARECER:
   - Alert nativo do navegador
   - Mensagem: "⚠️ CONFLITO DE HORÁRIO!"
   - NÃO deve criar
```

**Console deve mostrar:**
```
❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌
❌ CONFLITO DE HORÁRIOS DETECTADO!
❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌
🛑 CRIAÇÃO CANCELADA - Conflito
```

### Teste 2: Stamp2 Limite 20h ⚠️

```
1. Criar funcionário com Document Type: Stamp2

2. Criar 3 schedules de 8h cada:
   - Monday: 8:00 AM - 5:00 PM (8h)
   - Clicar Add ✅ OK
   
   - Tuesday: 8:00 AM - 5:00 PM (8h)
   - Clicar Add ✅ OK
   
   - Wednesday: 8:00 AM - 5:00 PM (8h)
   - Clicar Add
   
   ✅ NO 3º DIA DEVE APARECER:
   - Alert: "⚠️ LIMITE EXCEDIDO!"
   - Mostra: 16h + 8h = 24h > 20h
   - Modal de confirmação
```

**Console deve mostrar:**
```
📊 Cálculo de horas Stamp2: {
  currentHours: "16.00",
  newHours: "8.00",
  totalHours: "24.00",
  exceedsLimit: true
}
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
⚠️ LIMITE STAMP2 EXCEDIDO!
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
🛑 PAUSADO - Stamp2 limite
```

### Teste 3: Visto Expirado 🛂

```
1. Criar funcionário com:
   - Document Type: Stamp2 (ou Stamp1, Stamp4)
   - Visa Expiry Date: 2024-10-15 (passado!)

2. Tentar criar schedule para esse funcionário
   
   ✅ DEVE APARECER:
   - Alert: "🛂 VISTO EXPIRADO!"
   - Mostra data de expiração
   - Modal de confirmação
```

**Console deve mostrar:**
```
🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂
🛂 VISTO EXPIRADO!
🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂
🛑 PAUSADO - Visto expirado
```

## 📊 O Que Vai Aparecer

Quando uma validação falhar:

1. **Console (F12):** Logs em vermelho com ❌ ou 🛂 ou ⚠️
2. **Alert nativo:** Popup do navegador (impossível ignorar!)
3. **Modal customizado:** Tela de confirmação bonita
4. **Execução parada:** Não cria a escala

## 🎯 Se OS ALERTS AINDA NÃO APARECEREM

### Verificar no Console (F12):

Abra console ANTES de clicar em "Add to Schedule".

Quando clicar, deve aparecer:

```
================================================================================
🚀 INICIANDO CRIAÇÃO DE SCHEDULE
================================================================================
Dados do formulário: { employeeId: "1", days: [...], ... }
✅ Horários convertidos: {...}
🔍 Verificando conflitos...
```

Se os logs de validação NÃO aparecerem, o problema é outro.

### Me envie:

1. **Print do console** completo (F12)
2. **Print do Network tab** (F12 → Network → filter: schedules)
3. **Qual navegador** está usando?

## ⚠️ MUITO IMPORTANTE

**LIMPE O CACHE E DADOS DO SITE:**

```
F12 → Application → Storage → Clear site data
```

Dados antigos podem estar causando o problema!

**Teste após redeploy + limpar cache!** 🚀





