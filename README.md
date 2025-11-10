# Warehouse Schedule System

Sistema de controle de escala de trabalho para warehouse com interface moderna e responsiva.

## 🚀 Funcionalidades

- **Gestão de Funcionários**: Cadastro e gerenciamento de funcionários com cargos (Operador/Supervisor)
- **Criação de Escalas**: Sistema semanal com seleção de dias e horários AM/PM
- **Cálculo de Pagamentos**: Cálculo automático baseado em horas trabalhadas e cargos
- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- **Branding GLS**: Logo e cores corporativas implementadas

## 🛠️ Tecnologias

- React 18
- Vite
- React Router
- Date-fns
- CSS3 com responsividade

## 📱 Acesso

- **Local**: http://localhost:3000
- **Heroku**: https://warehouse-schedule-system.herokuapp.com

## 🎯 Como Usar

1. **Cadastrar Funcionários**: Adicione funcionários com nome e cargo
2. **Criar Escalas**: Selecione dias da semana e horários de trabalho
3. **Calcular Pagamentos**: Visualize os valores a serem pagos por funcionário

## 💰 Sistema de Pagamentos

### Operador

- Dias úteis: €13,50/hora
- Domingo: €23,00/hora

### Supervisor

- Dias úteis: €15,00/hora
- Domingo: €25,00/hora

## 🔧 Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📦 Deploy

O sistema está configurado para deploy automático no Heroku.
