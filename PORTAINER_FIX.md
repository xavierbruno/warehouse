# 🔧 Fix: Porta 5433 Já Está Alocada

## 🚨 Problema

```
Bind for 0.0.0.0:5433 failed: port is already allocated
```

A porta 5433 já está sendo usada por outro serviço no servidor do Portainer.

## ✅ Soluções

### Solução 1: Usar Porta Diferente (RECOMENDADO)

Altere a porta no `docker-compose.yml`:

```yaml
postgres:
  ports:
    - "5434:5432" # Ou 5435, 5436, etc
```

**Passos:**

1. No Portainer: Stack → Editor
2. Encontre a linha `- "5433:5432"`
3. Altere para `- "5434:5432"`
4. Clique em "Update the stack"

### Solução 2: Não Expor Porta (PRODUÇÃO)

Se você **não precisa** acessar o PostgreSQL de fora do Docker, remova a exposição de porta:

```yaml
postgres:
  # Remova ou comente a seção ports:
  # ports:
  #   - "5434:5432"
```

**Vantagens:**

- ✅ Mais seguro
- ✅ Sem conflito de portas
- ✅ Backend ainda funciona (usa rede interna)

**Desvantagem:**

- ❌ Não pode conectar do host com ferramentas externas (pgAdmin, DBeaver, etc)

### Solução 3: Identificar e Liberar a Porta

**No servidor do Portainer (SSH/Console):**

#### Linux:

```bash
# Verificar o que está usando a porta 5433
sudo lsof -i :5433

# Ou
sudo netstat -tulpn | grep 5433

# Parar o serviço (exemplo)
sudo systemctl stop nome-do-servico
```

#### Windows:

```powershell
# Verificar o que está usando a porta
netstat -ano | findstr :5433

# Matar o processo (substitua PID pelo número mostrado)
taskkill /PID <numero-do-pid> /F
```

### Solução 4: Usar Variável de Ambiente

Configure a porta via variável de ambiente no Portainer:

**docker-compose.yml:**

```yaml
postgres:
  ports:
    - "${POSTGRES_PORT:-5434}:5432"
```

**No Portainer:**

- Environment variables: `POSTGRES_PORT=5434`

## 🎯 Solução Rápida (Copy-Paste)

### Opção A: Porta 5434

No Editor do Portainer, altere:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: warehouse-postgres
    environment:
      POSTGRES_DB: warehouse_db
      POSTGRES_USER: warehouse_user
      POSTGRES_PASSWORD: warehouse_pass_2024
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "5434:5432" # ← ALTERADO AQUI
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./server/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - warehouse-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U warehouse_user -d warehouse_db"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Opção B: Sem Exposição de Porta (Mais Seguro)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: warehouse-postgres
    environment:
      POSTGRES_DB: warehouse_db
      POSTGRES_USER: warehouse_user
      POSTGRES_PASSWORD: warehouse_pass_2024
      PGDATA: /var/lib/postgresql/data/pgdata
    # NÃO expõe porta - apenas rede interna
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./server/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - warehouse-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U warehouse_user -d warehouse_db"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## 🔍 Como Escolher a Porta Certa

### Testar se a Porta Está Livre

**Linux:**

```bash
# Testar porta
nc -zv localhost 5434  # Se falhar, porta está livre

# Ou
telnet localhost 5434  # Se não conectar, porta está livre
```

**Windows:**

```powershell
# Testar porta
Test-NetConnection localhost -Port 5434

# Se retornar "TcpTestSucceeded : False", porta está livre
```

### Portas Comuns PostgreSQL

- `5432` - PostgreSQL padrão (provavelmente em uso)
- `5433` - Alternativa comum (em uso no seu caso)
- `5434` - ✅ RECOMENDADO
- `5435` - Alternativa
- `15432` - Outra alternativa comum

## 📝 Após Alterar a Porta

### Atualizar Documentação

Se você alterar para porta `5434`, atualize:

**README.md:**

```markdown
Port: 5434
```

**Conectar via psql:**

```bash
psql -h localhost -p 5434 -U warehouse_user -d warehouse_db
```

**Conectar via pgAdmin/DBeaver:**

```
Host: seu-servidor.com
Port: 5434
Database: warehouse_db
User: warehouse_user
Password: warehouse_pass_2024
```

## ✅ Checklist

### Deploy com Porta 5434:

- [ ] Alterar `docker-compose.yml`: `- "5434:5432"`
- [ ] Deploy no Portainer
- [ ] Verificar containers: `docker-compose ps`
- [ ] Testar conexão: `Test-NetConnection localhost -Port 5434`
- [ ] Executar migration de auth
- [ ] Criar usuário admin
- [ ] Acessar frontend

### Deploy sem Exposição de Porta:

- [ ] Remover/comentar seção `ports:` do postgres
- [ ] Deploy no Portainer
- [ ] Verificar containers
- [ ] Backend deve conectar normalmente
- [ ] Executar migration via console do container
- [ ] Criar usuário admin via console do container
- [ ] Acessar frontend

## 🎯 Recomendação

Para **produção no Portainer**, recomendo:

1. **Não expor a porta PostgreSQL** (Opção B)

   - Mais seguro
   - Sem conflitos
   - Backend funciona perfeitamente

2. **Acessar banco quando necessário:**

   ```bash
   # Via console do Portainer ou SSH
   docker exec -it warehouse-postgres psql -U warehouse_user -d warehouse_db
   ```

3. **Se precisar de acesso externo:**
   - Use porta diferente (5434+)
   - Configure firewall para aceitar apenas IPs confiáveis
   - Use SSL/TLS para conexão

## 🔒 Segurança

### Boas Práticas:

1. **Nunca expor PostgreSQL na internet diretamente**
2. Use SSH tunnel se precisar acessar remotamente:
   ```bash
   ssh -L 5434:localhost:5432 user@seu-servidor
   ```
3. Configure firewall:
   ```bash
   sudo ufw deny 5434/tcp  # Bloquear acesso externo
   ```
4. Use senhas fortes em produção

## 📞 Suporte Adicional

Se nenhuma solução funcionar, forneça:

1. Saída de: `docker ps -a`
2. Saída de: `netstat -tulpn | grep 543`
3. Sistema operacional do servidor Portainer
4. Logs do Portainer
