# 🚀 Guia de Deploy - GestorHS Sistema

## Deploy no Easypanel

### Pré-requisitos

1. Conta no Easypanel
2. Backend (API) já implantado e funcionando
3. Domínio configurado (opcional, mas recomendado)

---

## Método 1: Deploy via Git (Recomendado)

### 1. Configure o Repositório

Certifique-se de que seu código está em um repositório Git (GitHub, GitLab, Bitbucket).

### 2. Crie um Novo App no Easypanel

1. Acesse seu painel Easypanel
2. Clique em **"Create App"**
3. Selecione **"From Git Repository"**
4. Conecte seu repositório

### 3. Configure as Variáveis de Ambiente

No Easypanel, vá em **Environment Variables** e adicione:

```env
VITE_API_URL=https://sua-api.dominio.com/api/v1
VITE_APP_NAME=GestorHS Sistema
VITE_APP_VERSION=1.0.0
VITE_ENV=production
```

**⚠️ IMPORTANTE:** Substitua `https://sua-api.dominio.com/api/v1` pela URL real do seu backend!

### 4. Configure o Build

No Easypanel, configure:

- **Build Command:** `npm install && npm run build`
- **Start Command:** (deixe vazio, o Nginx cuidará disso)
- **Port:** `80`

### 5. Configure o Dockerfile

O Easypanel detectará automaticamente o `Dockerfile` no repositório.

### 6. Deploy

Clique em **Deploy** e aguarde o build completar.

---

## Método 2: Deploy Manual via Docker

### 1. Build da Imagem

```bash
# Clone o repositório
git clone seu-repositorio.git
cd gestorhs-sistema

# Build da imagem Docker
docker build -t gestorhs-frontend:latest .
```

### 2. Execute o Container

```bash
docker run -d \
  --name gestorhs-frontend \
  -p 80:80 \
  -e VITE_API_URL=https://sua-api.dominio.com/api/v1 \
  -e VITE_APP_NAME="GestorHS Sistema" \
  -e VITE_APP_VERSION=1.0.0 \
  -e VITE_ENV=production \
  gestorhs-frontend:latest
```

### 3. Verifique o Status

```bash
docker ps
docker logs gestorhs-frontend
```

---

## Configuração de Domínio

### No Easypanel

1. Vá em **Domains**
2. Adicione seu domínio personalizado
3. Configure o SSL (Let's Encrypt automático)

### DNS

Adicione um registro A ou CNAME apontando para o servidor do Easypanel:

```
Tipo: A
Nome: @  (ou www)
Valor: IP do servidor Easypanel
TTL: 3600
```

---

## Variáveis de Ambiente Detalhadas

### Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_URL` | URL base da API backend | `https://api.gestorhs.com/api/v1` |
| `VITE_ENV` | Ambiente de execução | `production` |

### Opcionais

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|--------|---------|
| `VITE_APP_NAME` | Nome da aplicação | GestorHS Sistema | `Minha Empresa` |
| `VITE_APP_VERSION` | Versão da aplicação | 1.0.0 | `2.0.0` |
| `VITE_DEBUG` | Modo debug | false | `false` |
| `VITE_API_TIMEOUT` | Timeout de requisições (ms) | 30000 | `60000` |

---

## Verificação Pós-Deploy

### 1. Health Check

Acesse: `https://seu-dominio.com/health`

Deve retornar: `healthy`

### 2. Teste a Aplicação

1. Acesse `https://seu-dominio.com`
2. Tente fazer login
3. Verifique se a conexão com a API está funcionando

### 3. Verifique os Logs

No Easypanel:
- Vá em **Logs**
- Procure por erros de conexão ou build

---

## Troubleshooting

### Problema: "Failed to fetch" ou erro de CORS

**Solução:** Verifique se:
1. A URL da API está correta em `VITE_API_URL`
2. O backend está configurado para aceitar requisições do domínio do frontend
3. O backend tem CORS habilitado corretamente

### Problema: Página em branco após deploy

**Solução:**
1. Verifique os logs do container
2. Confirme que o build foi concluído com sucesso
3. Verifique se as variáveis de ambiente estão configuradas

### Problema: Rotas retornam 404

**Solução:**
- O `nginx.conf` já está configurado para SPA routing
- Certifique-se de que o arquivo foi copiado corretamente no build

### Problema: Erro ao fazer login

**Solução:**
1. Verifique a URL da API em `VITE_API_URL`
2. Teste a API diretamente no navegador
3. Verifique os logs do backend

---

## Atualizações

### Easypanel (Git)

1. Faça commit das alterações
2. Push para o repositório
3. No Easypanel, clique em **Rebuild**

### Docker Manual

```bash
# Pull das últimas alterações
git pull

# Rebuild da imagem
docker build -t gestorhs-frontend:latest .

# Pare e remova o container antigo
docker stop gestorhs-frontend
docker rm gestorhs-frontend

# Execute o novo container
docker run -d --name gestorhs-frontend -p 80:80 \
  -e VITE_API_URL=https://sua-api.dominio.com/api/v1 \
  gestorhs-frontend:latest
```

---

## Backup

### Dados do Frontend

O frontend é stateless, não há dados para backup.

### Configurações

Mantenha backup de:
- `.env` ou variáveis de ambiente do Easypanel
- Configuração de domínio
- Configuração SSL

---

## Monitoramento

### Métricas Recomendadas

- Uptime (disponibilidade)
- Tempo de resposta
- Taxa de erros
- Uso de recursos (CPU/RAM)

### Ferramentas Sugeridas

- **Uptime Robot** - monitoramento de uptime gratuito
- **Google Analytics** - análise de uso
- **Sentry** - rastreamento de erros (opcional)

---

## Segurança

### Headers de Segurança

O `nginx.conf` já inclui:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### SSL/HTTPS

**⚠️ IMPORTANTE:** Sempre use HTTPS em produção!

O Easypanel configura SSL automaticamente via Let's Encrypt.

### Atualizações

Mantenha as dependências atualizadas:

```bash
npm audit
npm update
```

---

## Suporte

### Logs

```bash
# Docker
docker logs gestorhs-frontend

# Easypanel
Acesse: App > Logs
```

### Contato

Para suporte, consulte a documentação do projeto.

---

## Checklist de Deploy

- [ ] Backend implantado e funcionando
- [ ] Variável `VITE_API_URL` configurada corretamente
- [ ] Domínio configurado (opcional)
- [ ] SSL habilitado (HTTPS)
- [ ] Teste de login funcionando
- [ ] Teste de navegação entre páginas
- [ ] Teste de CRUD (criar, editar, excluir)
- [ ] Teste de upload de arquivos
- [ ] Verificação de responsividade mobile

---

**✅ Pronto! Seu GestorHS Sistema está implantado!**
