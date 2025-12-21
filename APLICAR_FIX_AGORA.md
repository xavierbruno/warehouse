# 🚨 APLICAR FIX AGORA

## O Que Foi Corrigido

❌ **ANTES:** Backend não salvava `document_type` e `visa_expiry`  
✅ **AGORA:** Backend salva TODOS os campos corretamente

## Passos Rápidos

```bash
# 1. Commit
git add .
git commit -m "fix: save document_type and visa_expiry in database"
git push

# 2. Redeploy
Portainer → Stacks → warehouse → Pull and redeploy
Aguardar ~2 minutos

# 3. Limpar Cache
Ctrl + Shift + Delete → Selecionar TUDO
OU
F12 → Application → Clear storage → Clear site data

# 4. Refresh
Ctrl + Shift + R
```

## Teste Rápido

### 1. Atualizar Funcionário Existente

No DBeaver:

```sql
-- Atualizar Bruno para ter document_type
UPDATE employees
SET document_type = 'Stamp2',
    visa_expiry = '2025-12-31'
WHERE name LIKE '%Bruno%';

-- Verificar
SELECT id, name, document_type, visa_expiry FROM employees;
```

### 2. Criar Schedule (Console F12 aberto!)

Tentar criar schedule para Bruno.

**Console DEVE mostrar:**

```
🔍 DADOS DO FUNCIONÁRIO SELECIONADO:
Document Type: Stamp2    <--- ✅ Agora tem valor!
```

**NÃO DEVE mostrar:**

```
Document Type: undefined    <--- ❌ Isso era o bug!
```

## Se Funcionar

✅ Validações agora vão funcionar:

- Stamp2 20h limit
- Visa expiry
- Schedule conflicts

## Se NÃO Funcionar

Me envie:

1. Screenshot do console (F12)
2. Resultado do SQL:

```sql
SELECT * FROM employees WHERE name LIKE '%Bruno%';
```

**TESTE AGORA! 🚀**




