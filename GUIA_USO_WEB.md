# 📱 Guia de Uso - Interface Web

## 🎯 Acesso ao Sistema

```
URL: http://213.199.59.34:3333
Login: admin
Senha: admin123
```

## 📋 Menu Principal

Após login, você verá 3 seções:

```
👥 Employees        → Gerenciar funcionários
📅 Create Schedule  → Criar escalas de trabalho
💰 Payment Calculator → Calcular pagamentos
```

## 1️⃣ Employees (Funcionários)

### Criar Novo Funcionário

**Desktop:**

1. Clique em **"+ Add New Employee"**
2. Preencha o formulário:
   - **Nome**: Nome completo (obrigatório)
   - **Position/Cargo**: Operator, Supervisor, Coordinator, Manager
   - **Phone**: Telefone de contato
   - **Email**: Email do funcionário
   - **Birth Date**: Data de nascimento
   - **Document Type**: Tipo de documento
   - **Visa Expiry**: Data de expiração do visto
3. Clique em **"Add Employee"**
4. ✅ Funcionário criado e salvo no PostgreSQL!

**Mobile:**

1. Clique no botão **"+"** flutuante (canto inferior direito)
2. Mesmos passos acima

### Editar Funcionário

1. Encontre o funcionário na lista
2. Clique no ícone de **editar** (lápis)
3. Modifique os campos
4. Clique em **"Save Changes"**
5. ✅ Atualizado no PostgreSQL!

### Deletar Funcionário

1. Encontre o funcionário na lista
2. Clique no ícone de **deletar** (lixeira)
3. Confirme a exclusão
4. ✅ Marcado como inativo no PostgreSQL!

## 2️⃣ Create Schedule (Criar Escalas)

### Criar Escala Semanal

1. **Selecione a Semana:**

   - Use o seletor de semana no topo
   - Ou navegue com setas < >

2. **Selecione os Dias:**

   - Clique nos dias da semana que deseja escalar
   - Segunda, Terça, Quarta, etc.

3. **Para Cada Dia:**

   - Selecione o **funcionário** no dropdown
   - Escolha o **horário**: AM (manhã) ou PM (tarde)
     - AM: 08:00 - 13:00
     - PM: 14:00 - 19:00
   - Ou defina horário customizado
   - Adicione **intervalo** se necessário

4. **Salvar:**
   - Clique em **"Save Schedule"**
   - ✅ Escala salva no PostgreSQL!

### Visualizar Escalas

- As escalas aparecem organizadas por dia
- Mostra: Nome do funcionário, horário, intervalo
- Pode remover escalas clicando no "X"

## 3️⃣ Payment Calculator (Cálculo de Pagamentos)

### Calcular Pagamentos da Semana

1. **Selecione a Semana:**

   - Use o seletor de semana

2. **Visualizar Cálculos:**

   - Sistema calcula automaticamente:
     - Total de horas trabalhadas
     - Horas em dias úteis
     - Horas no domingo
     - Valor total a pagar
   - Taxas aplicadas:
     - **Operator**: €13.50/h (úteis), €23.00/h (domingo)
     - **Supervisor**: €15.00/h (úteis), €25.00/h (domingo)

3. **Exportar PDF:**
   - Clique em **"Export PDF"** ou **"Download PDF"**
   - PDF com logo GLS e detalhes completos

## 📱 Interface Responsiva

### Desktop

- Menu no topo
- Tabelas completas
- Todos os campos visíveis

### Mobile/Tablet

- Menu inferior (bottom navigation)
- Botão flutuante "+" para ações rápidas
- Interface otimizada para touch

## 💡 Dicas de Uso

### Workflow Recomendado:

```
1. Cadastrar Funcionários
   ↓
2. Criar Escalas Semanais
   ↓
3. Calcular e Exportar Pagamentos
   ↓
4. Repetir para próximas semanas
```

### Boas Práticas:

- ✅ Cadastre todos os funcionários primeiro
- ✅ Crie escalas com antecedência
- ✅ Revise escalas antes de finalizar semana
- ✅ Exporte PDFs para arquivo
- ✅ Faça backup do banco regularmente

## 🔍 Atalhos e Dicas

### Navegação Rápida

- **Desktop**: Use os links no menu superior
- **Mobile**: Use a barra inferior

### Formulários

- **Enter**: Salvar formulário
- **Esc**: Cancelar/Fechar
- **Tab**: Navegar entre campos

### Listas

- **Scroll**: Ver mais funcionários
- **Search**: Buscar por nome (se implementado)
- **Filter**: Filtrar por cargo/departamento

## 🎯 Exemplo de Uso Completo

### Cenário: Configurar Semana de Trabalho

**Dia 1: Segunda-feira**

```
1. Login no sistema
2. Ir em /employees
3. Criar funcionários:
   - João Silva (Operator)
   - Maria Santos (Operator)
   - Roberto Lima (Supervisor)
```

**Dia 2: Terça-feira**

```
1. Ir em /schedule
2. Selecionar semana atual
3. Criar escalas:
   - Segunda: João (AM), Maria (PM)
   - Terça: Maria (AM), João (PM)
   - Quarta: João (Full), Roberto (AM)
   - Etc...
```

**Dia 3: Final da Semana**

```
1. Ir em /payments
2. Selecionar semana
3. Ver cálculos automáticos
4. Exportar PDF
5. Pagar funcionários 💰
```

## 🔄 Ciclo Semanal

```
Segunda → Criar escalas da semana
Terça-Sexta → Ajustar se necessário
Sábado → Revisar semana
Domingo → Calcular e exportar pagamentos
```

## 📞 Suporte

**Problemas?**

1. Ver logs do backend
2. Verificar se está logado
3. Limpar cache do navegador
4. Verificar conexão com API

**Documentação:**

- `README.md` - Overview
- `API.md` - Endpoints
- `DATABASE.md` - Banco de dados
- `AUTH.md` - Autenticação

**Tudo pronto para uso!** 🎉




