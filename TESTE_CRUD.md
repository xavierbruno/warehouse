# ✅ Teste do CRUD - Sistema Completo

## 🎯 O sistema possui CRUD completo via interface web!

### Funcionalidades Disponíveis:

- ✅ **Create** - Adicionar funcionários
- ✅ **Read** - Listar e visualizar funcionários
- ✅ **Update** - Editar informações
- ✅ **Delete** - Remover funcionários

## 🚀 Como Testar

### 1. Fazer Login

```
http://213.199.59.34:3333
```

Login: `admin` / `admin123`

### 2. Acessar Página de Funcionários

Após login, você será redirecionado para `/employees` automaticamente.

### 3. Criar Funcionário

1. Clique no botão **"+ Add New Employee"** ou **"Novo Funcionário"**
2. Preencha o formulário:
   - **Nome**: Nome do funcionário (obrigatório)
   - **Cargo/Position**: Operator, Supervisor, etc
   - **Telefone**: Opcional
   - **Email**: Opcional
   - **Data de Nascimento**: Opcional
   - **Tipo de Documento**: Opcional
   - **Visto Expira em**: Opcional
3. Clique em **"Salvar"**
4. O funcionário será **criado no PostgreSQL** via API

### 4. Editar Funcionário

1. Clique no botão de **"Editar"** (ícone de lápis) no funcionário
2. Modifique os campos desejados
3. Clique em **"Salvar"**
4. As alterações serão **salvas no PostgreSQL** via API

### 5. Deletar Funcionário

1. Clique no botão de **"Deletar"** (ícone de lixeira)
2. Confirme a exclusão
3. O funcionário será **marcado como inativo** no PostgreSQL

## 📡 Fluxo Técnico

```
Frontend (React)
    ↓
useEmployees hook
    ↓
src/utils/api.js (com token JWT)
    ↓
Backend API (POST /api/employees)
    ↓
PostgreSQL (INSERT INTO employees)
```

## 🔍 Endpoints da API Usados

### Create (Criar)

```
POST /api/employees
Headers: Authorization: Bearer <token>
Body: { name, position, email, phone, ... }
```

### Read (Listar)

```
GET /api/employees
Headers: Authorization: Bearer <token>
```

### Update (Atualizar)

```
PUT /api/employees/:id
Headers: Authorization: Bearer <token>
Body: { name, position, ... }
```

### Delete (Remover)

```
DELETE /api/employees/:id
Headers: Authorization: Bearer <token>
```

## 🧪 Verificar no Banco de Dados

Após criar funcionários pela interface, verifique no DBeaver:

```sql
-- Ver todos os funcionários
SELECT * FROM employees ORDER BY created_at DESC;

-- Ver funcionários criados hoje
SELECT * FROM employees
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Contar funcionários ativos
SELECT COUNT(*) as total FROM employees WHERE status = 'active';
```

## 📊 Ver Logs das Operações

Quando você criar/editar/deletar funcionários, os logs mostrarão:

```
Portainer → warehouse-backend → Logs
```

Exemplo:

```
📥 [REQUEST] POST /api/employees
   Body: { name: 'João Silva', position: 'Operator' }
📤 [RESPONSE] POST /api/employees - Status: 201
```

## 🐛 Troubleshooting

### Erro: "Token não fornecido"

**Causa:** Não está logado
**Solução:** Fazer login primeiro

### Erro: "Token inválido"

**Causa:** Token expirou (24h)
**Solução:** Fazer login novamente

### Erro ao criar funcionário

**Ver logs:**

```
Containers → warehouse-backend → Logs
```

**Causas comuns:**

- Validação de campos
- Erro de conexão com banco
- Campo obrigatório faltando

### Funcionário não aparece na lista

**Verificar:**

1. Limpar cache do navegador
2. Refresh da página
3. Ver no banco: `SELECT * FROM employees;`
4. Ver logs do backend

## ✅ Checklist de Teste

- [ ] Login funcionando
- [ ] Página /employees carrega
- [ ] Botão "Add New Employee" aparece
- [ ] Formulário de criação abre
- [ ] Consegue criar funcionário
- [ ] Funcionário aparece na lista
- [ ] Consegue editar funcionário
- [ ] Consegue deletar funcionário
- [ ] Dados persistem no PostgreSQL

## 🎯 Próximos Passos

1. **Faça login** no sistema
2. **Crie alguns funcionários** pela interface
3. **Teste editar** e deletar
4. **Verifique no banco** se os dados estão sendo salvos
5. **Crie escalas** para os funcionários em `/schedule`
6. **Calcule pagamentos** em `/payments`

## 📝 Estrutura do Sistema

```
/employees      → Gerenciar funcionários (CRUD)
/schedule       → Criar escalas de trabalho
/payments       → Calcular pagamentos
```

**Tudo integrado com PostgreSQL via API REST!** 🚀

## 🔒 Segurança

Todas as operações requerem autenticação JWT:

- ✅ Token é adicionado automaticamente nas requisições
- ✅ Se token expirar, redireciona para login
- ✅ Apenas usuários autenticados podem fazer CRUD

**Sistema pronto para uso via interface web!** 🎉




