# 🔍 Análise do Erro DNS Persistente

## ❌ Erro Repetido

```
getaddrinfo ENOTFOUND db.jqohmvkbzpencpbyyubu.supabase.co
```

## 🔍 Por que esse erro persiste?

### Possíveis Causas Reais

1. **Hostname Incorreto ou Projeto Inexistente**
   - O projeto Supabase pode ter sido deletado
   - O hostname pode estar errado
   - O projeto pode ter sido recriado com novo hostname

2. **Projeto Pausado**
   - Projetos gratuitos do Supabase são pausados após 7 dias de inatividade
   - Quando pausado, o DNS deixa de funcionar

3. **Problemas de Rede/DNS no Windows/WSL2**
   - WSL2 tem problemas conhecidos com DNS
   - Firewall ou antivírus bloqueando

4. **Connection String Incorreta**
   - Copiada incorretamente do dashboard
   - Hostname antigo de um projeto deletado

## ✅ Como Diagnosticar

### 1. Verificar no Dashboard do Supabase

**CRUCIAL:** Você precisa acessar o dashboard e verificar:

1. Acesse: https://supabase.com/dashboard
2. Veja se o projeto existe na lista
3. Clique no projeto
4. Verifique o status:
   - ✅ **Active** = Projeto ativo
   - ⏸️ **Paused** = Projeto pausado (precisa restaurar)
   - ❌ Não aparece = Projeto deletado

### 2. Se o Projeto Está Pausado

1. No dashboard, clique no projeto
2. Clique em **"Restore"** ou **"Resume"**
3. Aguarde alguns minutos para o projeto reativar
4. Depois que reativar, vá em **Settings > Database**
5. **COPIE A CONNECTION STRING NOVA** (pode ter mudado!)

### 3. Se o Projeto Não Existe

Você precisa criar um novo projeto:
1. No dashboard, clique em **"New Project"**
2. Preencha os dados
3. Aguarde a criação (2-3 minutos)
4. Vá em **Settings > Database**
5. Copie a connection string
6. Atualize o `.env` com a NOVA connection string

## 🔧 Solução Imediata: Usar PostgreSQL Local

Enquanto resolve o problema do Supabase, use PostgreSQL local:

### Passo 1: Garantir que Supabase está desabilitado

Verifique o `.env` na raiz:
```env
# SUPABASE_DB_URL deve estar comentado ou removido
```

### Passo 2: Iniciar PostgreSQL local

```bash
docker-compose up -d postgres
```

### Passo 3: Aguardar e testar

```bash
# Aguardar 15 segundos
cd server
npm start
```

## 📋 Checklist de Diagnóstico

- [ ] Projeto existe no dashboard do Supabase?
- [ ] Projeto está "Active" (não pausado)?
- [ ] Connection string copiada diretamente do dashboard?
- [ ] Hostname no .env é exatamente igual ao do dashboard?
- [ ] Testou ping/nslookup do hostname?
- [ ] PostgreSQL local funciona quando Supabase está desabilitado?

## 💡 Recomendação

**Para desenvolvimento local, PostgreSQL local é mais confiável:**
- ✅ Funciona offline
- ✅ Sem problemas de DNS/rede
- ✅ Mais rápido
- ✅ Controle total

**Use Supabase apenas para:**
- Produção
- Compartilhar dados entre ambientes
- Backup automático

## 🔄 Próximos Passos

1. **AGORA:** Use PostgreSQL local (já está configurado)
2. **DEPOIS:** Verifique/corrija o Supabase no dashboard
3. **OPCIONAL:** Quando Supabase estiver funcionando, descomente no `.env`

