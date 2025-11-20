# 🔧 Configuração de Variáveis de Ambiente

## Para Deploy no Easypanel

⚠️ **IMPORTANTE:** Essas variáveis precisam estar disponíveis **DURANTE O BUILD**, não apenas em runtime!

### Variáveis Obrigatórias

Configure estas variáveis no painel do Easypanel em **Environment Variables** ou **Build Arguments**:

```env
VITE_API_URL=https://sua-api.dominio.com/api/v1
VITE_ENV=production
```

### Variáveis Opcionais

```env
VITE_APP_NAME=GestorHS Sistema
VITE_APP_VERSION=1.0.0
```

### Como Configurar no Easypanel

1. Vá em **Settings** > **Environment** (ou **Build Arguments**)
2. Adicione cada variável:
   - Nome: `VITE_API_URL`
   - Valor: `https://sua-api.dominio.com/api/v1`
3. Repita para as demais variáveis
4. Salve e faça o deploy

---

## ⚠️ IMPORTANTE

### VITE_API_URL

Esta é a variável **MAIS IMPORTANTE**. Ela define onde o frontend vai buscar os dados.

**Exemplos corretos:**
- `https://api.gestorhs.com/api/v1`
- `https://backend.meudominio.com/api/v1`
- `https://meudominio.com/api/v1`

**❌ Exemplos INCORRETOS:**
- `http://localhost:8000/api/v1` (não use localhost em produção!)
- `https://api.gestorhs.com/api/v1/` (não termine com barra `/`)
- `https://api.gestorhs.com` (falta o `/api/v1`)

### Como descobrir a URL da API?

1. Acesse o painel do seu backend no Easypanel
2. Vá em **Domains** ou **Settings**
3. Copie a URL completa
4. Adicione `/api/v1` no final (se sua API usa esse padrão)

---

## Teste Rápido

Após configurar, teste se a API está acessível:

```bash
# Substitua pela sua URL
curl https://sua-api.dominio.com/api/v1/health

# Ou no navegador, acesse:
https://sua-api.dominio.com/api/v1/health
```

Deve retornar algo como:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

## Checklist de Configuração

- [ ] `VITE_API_URL` configurada com a URL do backend
- [ ] Backend está rodando e acessível
- [ ] URL do backend testada no navegador
- [ ] Não há barra `/` no final da URL
- [ ] `VITE_ENV` está como `production`
- [ ] Frontend faz build sem erros
- [ ] Teste de login funcionando

---

## Problemas Comuns

### "Failed to fetch" ou erro de CORS

**Causa:** O backend não está configurado para aceitar requisições do frontend.

**Solução:**
1. Configure o CORS no backend para aceitar o domínio do frontend
2. Verifique se a URL da API está correta

### Página em branco após login

**Causa:** `VITE_API_URL` incorreta ou backend offline.

**Solução:**
1. Verifique a URL no console do navegador (F12)
2. Teste a API diretamente no navegador
3. Verifique os logs do backend

### Imagens não carregam

**Causa:** O backend pode estar retornando URLs relativas.

**Solução:**
1. Configure o backend para retornar URLs absolutas
2. Ou configure o frontend para construir as URLs completas

---

## Ambiente de Desenvolvimento vs Produção

### Desenvolvimento (`.env`)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_ENV=development
```

### Produção (Easypanel)
```env
VITE_API_URL=https://sua-api.dominio.com/api/v1
VITE_ENV=production
```

**Nunca** use `localhost` em produção!

---

## Build Local (Opcional)

Se quiser testar o build localmente antes do deploy:

```bash
# 1. Configure o .env
cp .env.production.example .env.production

# 2. Edite o .env.production
nano .env.production

# 3. Build
npm run build

# 4. Preview
npm run preview
```

---

**✅ Pronto! Suas variáveis estão configuradas!**

Próximo passo: [DEPLOYMENT.md](./DEPLOYMENT.md)
