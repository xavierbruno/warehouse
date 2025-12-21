# 🔧 Solução: Erro ENOTFOUND - DNS não resolve

## ❌ Erro Encontrado

```
getaddrinfo ENOTFOUND db.jqohmvkbzpencpbyyubu.supabase.co
```

## ✅ Progresso!

O erro mudou! Isso significa que:
- ✅ A connection string está sendo parseada corretamente
- ✅ O formato da URL está correto
- ❌ Mas o DNS não consegue resolver o hostname do Supabase

## 🔍 Possíveis Causas

1. **Hostname incorreto** - O hostname no `.env` pode estar errado
2. **Projeto Supabase pausado** - Projetos gratuitos podem ser pausados após inatividade
3. **Projeto deletado** - O projeto pode ter sido removido
4. **Problemas de rede/DNS** - Problemas temporários de conectividade

## ✅ Soluções

### 1. Verificar o hostname no Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Database**
4. Na seção **Connection string**, copie a URL completa
5. Verifique se o hostname é exatamente: `db.jqohmvkbzpencpbyyubu.supabase.co`

**Importante:** O hostname pode mudar se o projeto foi recriado ou restaurado!

### 2. Verificar se o projeto está ativo

No dashboard do Supabase:
- Veja se o projeto está "Active" (não pausado)
- Se estiver pausado, clique em "Resume" ou "Restore"

### 3. Testar conectividade

No terminal, teste:

```bash
# Windows
ping db.jqohmvkbzpencpbyyubu.supabase.co

# Ou teste DNS
nslookup db.jqohmvkbzpencpbyyubu.supabase.co
```

Se não conseguir resolver, o hostname pode estar incorreto.

### 4. Obter Connection String correta

No Supabase Dashboard:
1. **Settings** > **Database**
2. Na seção **Connection string**, selecione **URI**
3. Copie a URL completa
4. Atualize o `.env` com a URL correta

### 5. Se usar WSL2 no Windows

Às vezes há problemas de DNS no WSL2. Tente:

```bash
# No WSL2
sudo bash -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf'
```

## 📝 Atualizar .env com Connection String Correta

Depois de obter a connection string correta do Supabase:

```env
# Substitua pela connection string CORRETA do seu projeto
SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA@db.SEU_HOSTNAME.supabase.co:5432/postgres
SUPABASE_SSL=true
```

**Lembre-se:** Use URL encoding para caracteres especiais na senha!
- `!` = `%21`
- `@` = `%40`
- etc.

## 🔍 Como saber se o hostname está correto

A connection string do Supabase tem o formato:
```
postgresql://postgres:SENHA@db.XXXXX.supabase.co:5432/postgres
                                     ^^^^^
                                     Este código é único para cada projeto
```

Se você recriou o projeto ou restaurou de backup, o código `XXXXX` muda!

## ✅ Checklist

- [ ] Projeto Supabase está ativo (não pausado)
- [ ] Hostname copiado diretamente do Dashboard
- [ ] Connection string atualizada no `.env`
- [ ] Senha codificada com URL encoding se tiver caracteres especiais
- [ ] Testado ping/nslookup do hostname

