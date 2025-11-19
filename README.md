# 🏭 GestorHS Sistema

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Sistema completo para gestão de calibração de equipamentos industriais

[Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Documentação](#-documentação) • [Deploy](#-deploy)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Integration](#-api-integration)
- [Deploy](#-deploy)
- [Arquitetura](#-arquitetura)
- [Contribuindo](#-contribuindo)

---

## 🎯 Sobre o Projeto

O **GestorHS Sistema** é uma aplicação web completa para gestão de calibração de equipamentos industriais, focada em controle de ordens de serviço, gerenciamento de clientes (empresas), catálogo de equipamentos e geração de relatórios.

### 🎯 Objetivo

Facilitar o controle completo do ciclo de vida de calibração de equipamentos, desde a solicitação do serviço até a entrega do certificado de calibração, com rastreamento em tempo real e notificações automáticas.

### 👥 Perfis de Usuário

- **Admin**: Acesso total ao sistema, gerenciamento de usuários e configurações
- **Gerente**: Leitura total, escrita limitada, supervisão de operações
- **Técnico**: Manipulação de OS e calibrações, execução de serviços
- **Atendente**: Leitura geral, criação de ordens de serviço

---

## 🚀 Tecnologias

### Core

- **[React 19.1.0](https://react.dev/)** - Biblioteca UI
- **[TypeScript 5.8.3](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite 7.0.0](https://vitejs.dev/)** - Build tool e dev server

### UI & Styling

- **[TailwindCSS 3.4.1](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[React Hot Toast](https://react-hot-toast.com/)** - Notificações

### Formulários & Validação

- **[React Hook Form 7.54.2](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod 3.24.1](https://zod.dev/)** - Validação de schemas
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integração Zod + RHF

### Data & State

- **[Axios 1.7.9](https://axios-http.com/)** - Cliente HTTP
- **Context API** - Gerenciamento de estado global
- **React Router DOM 7.1.1** - Roteamento

### Gráficos & Visualização

- **[Recharts 2.15.0](https://recharts.org/)** - Gráficos e dashboards

### Utilitários

- **[date-fns 4.1.0](https://date-fns.org/)** - Manipulação de datas
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para className
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge de classes Tailwind

---

## ✨ Funcionalidades

### 📊 Dashboard Interativo

- **7 Cards Informativos** com métricas em tempo real:
  - 🔧 Ordens em Andamento
  - 😟 Clientes Atrasados
  - 📅 Calibrações Atrasadas
  - ▶️ Calibrações Próximas
  - 👍 Ordens Finalizadas (30 dias)
  - 🚫 Calibrações "Não Fazer"
  - 🔕 Clientes Perdidos
- Busca rápida de OS por número
- Gráficos de tendências (opcional)
- Click nos cards para drill-down

### 🏢 Gestão de Empresas

- **CRUD Completo** de empresas/clientes
- Suporte para **Pessoa Jurídica (PJ)** e **Pessoa Física (PF)**
- Validação de **CNPJ/CPF** com máscaras
- **Integração ViaCEP** para preenchimento automático de endereço
- Upload de logo/documentos
- Histórico de alterações
- Controle de status: Ativo, Inativo, Perdido
- Visualização de equipamentos e OSs da empresa

### 🔧 Catálogo de Equipamentos

- Cadastro de equipamentos com:
  - Categoria e Marca
  - Código único e descrição
  - Especificações técnicas
  - Período de calibração (dias)
  - Preços e custos
  - Upload de imagens e vídeos
  - Tags e palavras-chave
- Vinculação de equipamentos a empresas com:
  - Número de série
  - Número de patrimônio
  - Data de compra
  - Controle de próxima calibração

### 📝 Ordens de Serviço (OS)

- **Workflow Completo** com 8 fases:
  1. Solicitado
  2. Enviado
  3. Recebido
  4. Em Calibração
  5. Calibrado
  6. Retornando
  7. Entregue
  8. Cancelado
- **Chave de acesso** única por OS
- Timeline visual de fases
- Finalização com:
  - Dados de calibração (testes 1, 2, 3, média)
  - Número de certificado
  - Upload de certificado PDF
  - Cálculo automático da próxima calibração
- Filtros avançados (empresa, fase, situação, período)
- Notificações automáticas

### 📈 Relatórios

- **Relatório de Vencimentos** (Excel)
  - Programação de calibrações
  - Filtro por empresa e antecedência
- **Relatório de Calibrações** (PDF/Excel)
  - Histórico de calibrações por período
  - Filtros por empresa, equipamento, situação
- **Relatório de Equipamentos** (Excel)
  - Inventário completo
  - Filtros por categoria, marca, status
- **Relatório Financeiro** (Excel)
  - Faturamento por período
  - Agrupamento por mês/cliente/equipamento
- **Certificado Individual** (PDF)
  - Download de certificados de calibração
- **Ordem de Serviço** (PDF)
  - Impressão de OS individual

### 👤 Gestão de Usuários

- CRUD completo de usuários (admin apenas)
- 4 perfis: Admin, Gerente, Técnico, Atendente
- Upload de avatar
- Alteração de senha
- Ativação/desativação de contas
- Filtros e busca

### ⚙️ Configurações

- **Categorias de Equipamentos**
  - Criar, editar, excluir categorias
  - Controle de status (ativo/inativo)
- **Marcas/Fabricantes**
  - Gerenciamento de marcas
  - Controle de status
- Interface com abas para organização
- Acessível apenas para Admin

### 🔐 Autenticação & Segurança

- Login com email/senha
- **JWT Authentication** com refresh token automático
- Persistência de sessão
- Proteção de rotas por perfil
- Auto logout em caso de token expirado
- Interceptors Axios para gerenciamento de tokens

### 🎨 UX & Interface

- **Design System** consistente
- **Dark Mode** como padrão
- **Responsivo**: Desktop, Tablet, Mobile
- Loading states e skeleton loaders
- Toast notifications para feedback
- Confirmações antes de ações destrutivas
- Validação em tempo real de formulários

---

## 📁 Estrutura do Projeto

```
gestorhs-sistema/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── common/          # Button, Input, Badge, Spinner, etc
│   │   ├── dashboard/       # MetricCard, ChartCard
│   │   ├── forms/           # FileUpload
│   │   ├── modals/          # Modal, ConfirmDialog
│   │   └── table/           # DataTable, Pagination
│   │
│   ├── context/             # Context API
│   │   ├── AuthContext.tsx        # Autenticação
│   │   ├── DashboardContext.tsx   # Métricas do dashboard
│   │   └── ThemeContext.tsx       # Dark/Light mode
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts            # Hook de autenticação
│   │   ├── useDebounce.ts        # Debounce para busca
│   │   └── usePagination.ts      # Paginação
│   │
│   ├── pages/               # Páginas principais
│   │   ├── empresas/             # Empresas (List, Form, Details)
│   │   ├── equipamentos/         # Equipamentos (List, Form, Details)
│   │   ├── ordens-servico/       # Ordens de Serviço (List, Form, Details)
│   │   ├── relatorios/           # Relatórios
│   │   ├── usuarios/             # Usuários (admin)
│   │   ├── configuracoes/        # Configurações (admin)
│   │   ├── Dashboard.tsx         # Dashboard principal
│   │   ├── Login.tsx             # Página de login
│   │   └── NotFound.tsx          # 404
│   │
│   ├── services/            # Integração com API
│   │   ├── api.ts                     # Axios instance
│   │   ├── auth.service.ts            # Autenticação
│   │   ├── dashboard.service.ts       # Dashboard
│   │   ├── empresa.service.ts         # Empresas
│   │   ├── equipamento.service.ts     # Equipamentos
│   │   ├── equipamento-empresa.service.ts
│   │   ├── ordem-servico.service.ts   # Ordens de Serviço
│   │   ├── relatorio.service.ts       # Relatórios
│   │   ├── usuario.service.ts         # Usuários
│   │   ├── categoria.service.ts       # Categorias
│   │   ├── marca.service.ts           # Marcas
│   │   └── upload.service.ts          # Upload de arquivos
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts              # Tipos globais
│   │
│   ├── utils/               # Utilitários
│   │   ├── formatters.ts         # Formatadores (CNPJ, telefone, etc)
│   │   ├── validators.ts         # Validadores customizados
│   │   └── cn.ts                 # className utility
│   │
│   ├── styles/
│   │   └── index.css             # Estilos globais + Tailwind
│   │
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── router.tsx           # Configuração de rotas
│
├── public/                  # Assets estáticos
├── .env.example             # Exemplo de variáveis de ambiente
├── .env.production.example  # Exemplo para produção
├── Dockerfile               # Docker multi-stage build
├── docker-compose.yml       # Docker Compose
├── nginx.conf               # Configuração Nginx
├── vite.config.ts           # Configuração Vite
├── tailwind.config.js       # Configuração Tailwind
├── tsconfig.json            # Configuração TypeScript
├── package.json             # Dependências
├── DEPLOYMENT.md            # Guia de deploy
└── ENV_SETUP.md             # Guia de variáveis de ambiente
```

---

## 💻 Instalação

### Pré-requisitos

- **Node.js** 20+
- **npm** ou **yarn**
- **Git**

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/gestorhs-sistema.git
cd gestorhs-sistema
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=GestorHS Sistema
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória | Padrão |
|----------|-----------|-------------|--------|
| `VITE_API_URL` | URL da API backend | ✅ Sim | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | Nome da aplicação | Não | `GestorHS Sistema` |
| `VITE_APP_VERSION` | Versão da aplicação | Não | `1.0.0` |
| `VITE_ENV` | Ambiente (development/production) | Não | `development` |

### TypeScript Path Aliases

O projeto usa `@/` como alias para `./src/`:

```typescript
// Ao invés de:
import { Button } from '../../../components/common/Button'

// Use:
import { Button } from '@/components/common'
```

---

## 🎮 Uso

### Login

Use as credenciais fornecidas pelo administrador do sistema:

```
Login: admin
Senha: admin123
```

### Navegação

- **Dashboard** - Métricas e visão geral
- **Empresas** - Gerenciar clientes
- **Equipamentos** - Catálogo de produtos
- **Ordens de Serviço** - Workflow de calibração
- **Relatórios** - Exportar dados
- **Usuários** (Admin) - Gerenciar usuários
- **Configurações** (Admin) - Categorias e marcas

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + K` | Busca global |
| `Esc` | Fechar modal |
| `Alt + N` | Nova OS |

---

## 🔌 API Integration

### Base URL

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
```

### Autenticação

Todas as requisições incluem automaticamente o token JWT:

```typescript
Authorization: Bearer {access_token}
```

### Exemplo de Serviço

```typescript
// src/services/empresa.service.ts
import api from './api';

export const empresaService = {
  async list(params?: { page?: number; size?: number }) {
    const response = await api.get('/empresas', { params });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/empresas/${id}`);
    return response.data.data;
  },

  async create(data: EmpresaFormData) {
    const response = await api.post('/empresas', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<EmpresaFormData>) {
    const response = await api.put(`/empresas/${id}`, data);
    return response.data.data;
  },

  async delete(id: number) {
    await api.delete(`/empresas/${id}`);
  },
};
```

### Interceptors

O sistema possui interceptors configurados para:

- **Request**: Adicionar token JWT automaticamente
- **Response**: Refresh automático do token em caso de 401

```typescript
// Refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Logout e redirecionar para login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 🌐 API REST Documentation

A API backend é construída com **FastAPI (Python)** e fornece endpoints RESTful completos.

### 📍 Base URL

- **Produção**: `https://gestorhsapi.healthsafetytech.com/api/v1`
- **Desenvolvimento**: `http://localhost:8000/api/v1`
- **Documentação Interativa**: `https://gestorhsapi.healthsafetytech.com/docs`

### 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "login": "admin",
  "senha": "admin123"
}
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Usuário Atual

```http
GET /api/v1/auth/me
Authorization: Bearer {access_token}
```

### 📊 Estrutura de Paginação

Todos os endpoints de listagem suportam paginação:

**Query Parameters:**
- `page` - Número da página (padrão: 1)
- `size` - Itens por página (padrão: 20, máx: 100)

**Resposta:**

```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "size": 20,
  "pages": 8
}
```

---

### 📋 Endpoints Principais

#### 👤 Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/usuarios` | Listar usuários | ✅ |
| `GET` | `/usuarios/{id}` | Buscar usuário | ✅ |
| `POST` | `/usuarios` | Criar usuário (admin) | ✅ Admin |
| `PUT` | `/usuarios/{id}` | Atualizar usuário (admin) | ✅ Admin |
| `DELETE` | `/usuarios/{id}` | Deletar usuário (admin) | ✅ Admin |
| `PATCH` | `/usuarios/{id}/ativar` | Ativar/Desativar | ✅ Admin |
| `PATCH` | `/usuarios/{id}/senha` | Alterar senha | ✅ |

**Filtros disponíveis:**
- `nome` - Nome do usuário
- `email` - Email do usuário
- `perfil` - Perfil (admin, gerente, tecnico, atendente)
- `ativo` - Status (S/N)

**Exemplo - Criar Usuário:**

```http
POST /api/v1/usuarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "login": "joao",
  "senha": "senha123",
  "perfil": "tecnico",
  "telefone": "11999999999",
  "ativo": "S"
}
```

---

#### 🏢 Empresas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/empresas` | Listar empresas | ✅ |
| `GET` | `/empresas/{id}` | Buscar empresa | ✅ |
| `POST` | `/empresas` | Criar empresa | ✅ |
| `PUT` | `/empresas/{id}` | Atualizar empresa | ✅ |
| `DELETE` | `/empresas/{id}` | Deletar empresa | ✅ |
| `PATCH` | `/empresas/{id}/ativar` | Ativar/Desativar | ✅ |
| `PATCH` | `/empresas/{id}/status-contato` | Atualizar status contato | ✅ |
| `GET` | `/empresas/{id}/historico` | Histórico de alterações | ✅ |

**Filtros disponíveis:**
- `razao_social` - Razão social
- `cnpj` - CNPJ (apenas PJ)
- `cpf` - CPF (apenas PF)
- `tipo_pessoa` - Tipo (J=PJ, F=PF)
- `ativo` - Status (S/N)
- `status_contato` - Status contato (ativo, inativo, perdido)
- `cidade` - Cidade
- `estado` - UF (2 letras)

**Exemplo - Criar Empresa PJ:**

```http
POST /api/v1/empresas
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo_pessoa": "J",
  "cnpj": "12345678000190",
  "razao_social": "Empresa XYZ Ltda",
  "nome_fantasia": "XYZ",
  "cep": "01310100",
  "logradouro": "Av. Paulista",
  "numero": "1000",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "telefone": "1133334444",
  "email": "contato@xyz.com.br",
  "ativo": "S",
  "status_contato": "ativo"
}
```

---

#### 🔧 Equipamentos (Catálogo)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/equipamentos` | Listar equipamentos | ✅ |
| `GET` | `/equipamentos/{id}` | Buscar equipamento | ✅ |
| `POST` | `/equipamentos` | Criar equipamento | ✅ |
| `PUT` | `/equipamentos/{id}` | Atualizar equipamento | ✅ |
| `DELETE` | `/equipamentos/{id}` | Deletar equipamento | ✅ |

**Filtros disponíveis:**
- `descricao` - Descrição do equipamento
- `codigo` - Código único
- `categoria_id` - ID da categoria
- `marca_id` - ID da marca
- `ativo` - Status (S/N)
- `destaque` - Destaque (S/N)

**Exemplo - Criar Equipamento:**

```http
POST /api/v1/equipamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoria_id": 1,
  "marca_id": 2,
  "codigo": "BAF-001",
  "descricao": "Bafômetro Digital Portátil",
  "modelo": "AD500",
  "periodo_calibracao_dias": 365,
  "preco_por": 150.00,
  "ativo": "S",
  "destaque": "S"
}
```

---

#### 🔗 Equipamentos-Empresa (Vinculação)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/equipamentos-empresa` | Listar vinculações | ✅ |
| `GET` | `/equipamentos-empresa/{id}` | Buscar vinculação | ✅ |
| `POST` | `/equipamentos-empresa` | Vincular equipamento | ✅ |
| `PUT` | `/equipamentos-empresa/{id}` | Atualizar vinculação | ✅ |
| `PATCH` | `/equipamentos-empresa/{id}/recusar-calibracao` | Marcar "não vai fazer" | ✅ |
| `GET` | `/equipamentos-empresa/vencimentos/proximos` | Vencimentos próximos | ✅ |

**Filtros disponíveis:**
- `empresa_id` - ID da empresa
- `equipamento_id` - ID do equipamento
- `numero_serie` - Número de série
- `status` - Status (A=Ativo, I=Inativo, M=Manutenção, B=Baixado)
- `vencimento_ate` - Data limite de vencimento

**Exemplo - Vincular Equipamento:**

```http
POST /api/v1/equipamentos-empresa
Authorization: Bearer {token}
Content-Type: application/json

{
  "equipamento_id": 5,
  "empresa_id": 10,
  "numero_serie": "SN123456",
  "numero_patrimonio": "PAT-001",
  "data_compra": "2024-01-15",
  "status": "A",
  "ativo": "S"
}
```

---

#### 📝 Ordens de Serviço

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/ordens-servico` | Listar OS | ✅ |
| `GET` | `/ordens-servico/{id}` | Buscar OS | ✅ |
| `GET` | `/ordens-servico/chave/{chave}` | Buscar por chave (público) | ❌ |
| `POST` | `/ordens-servico` | Criar OS | ✅ |
| `PUT` | `/ordens-servico/{id}` | Atualizar OS | ✅ |
| `DELETE` | `/ordens-servico/{id}` | Cancelar OS | ✅ |
| `PATCH` | `/ordens-servico/{id}/fase` | Mudar fase | ✅ |
| `POST` | `/ordens-servico/{id}/finalizar` | Finalizar OS | ✅ |
| `PATCH` | `/ordens-servico/{id}/pagar` | Marcar como pago | ✅ |
| `GET` | `/ordens-servico/{id}/logs` | Logs da OS | ✅ |

**Filtros disponíveis:**
- `empresa_id` - ID da empresa
- `equipamento_empresa_id` - ID do equipamento vinculado
- `fase_id` - ID da fase (1-8)
- `situacao_servico` - Situação (E=Em espera, A=Andamento, F=Finalizada, C=Cancelada)
- `pago` - Pago (S/N)
- `data_inicio` - Data inicial
- `data_fim` - Data final

**Fases da OS:**
1. Solicitado
2. Enviado
3. Recebido
4. Em Calibração
5. Calibrado
6. Retornando
7. Entregue
8. Cancelado

**Exemplo - Criar OS:**

```http
POST /api/v1/ordens-servico
Authorization: Bearer {token}
Content-Type: application/json

{
  "empresa_id": 10,
  "equipamento_empresa_id": 25,
  "observacoes": "Calibração anual",
  "valor_servico": 150.00,
  "valor_frete_envio": 20.00,
  "valor_frete_retorno": 20.00
}
```

**Exemplo - Finalizar OS:**

```http
POST /api/v1/ordens-servico/123/finalizar
Authorization: Bearer {token}
Content-Type: application/json

{
  "data_calibracao": "2025-11-19T14:30:00",
  "certificado_numero": "CERT-2025-001",
  "teste_1": "0.25",
  "teste_2": "0.26",
  "teste_3": "0.25",
  "teste_media": "0.253",
  "situacao_calibracao": "Aprovado",
  "certificado_temperatura": "23°C",
  "certificado_pressao": "1013 hPa"
}
```

---

#### 📊 Dashboard

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/dashboard/principal` | Métricas principais (7 cards) | ✅ |
| `GET` | `/dashboard/andamento` | OSs em andamento | ✅ |
| `GET` | `/dashboard/calibracoes-atrasadas` | Calibrações vencidas | ✅ |
| `GET` | `/dashboard/calibracoes-proximas` | Vencimentos próximos | ✅ |
| `GET` | `/dashboard/finalizadas` | OSs finalizadas (30 dias) | ✅ |
| `GET` | `/dashboard/grafico-mensal` | Gráfico de OSs por mês | ✅ |

**Exemplo - Métricas Principais:**

```http
GET /api/v1/dashboard/principal
Authorization: Bearer {token}
```

**Resposta:**

```json
{
  "ordens_andamento": 563,
  "clientes_atrasados": 830,
  "calibracoes_atrasadas": 2815,
  "calibracoes_proximas": 106,
  "ordens_finalizadas_30dias": 9,
  "calibracoes_nao_fazer": 121,
  "clientes_perdidos": 6
}
```

---

### 🔧 Categorias e Marcas

Endpoints para configurações (admin apenas):

**Categorias:**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/equipamentos/categorias` | Listar categorias |
| `POST` | `/equipamentos/categorias` | Criar categoria |
| `PUT` | `/equipamentos/categorias/{id}` | Atualizar categoria |
| `DELETE` | `/equipamentos/categorias/{id}` | Deletar categoria |

**Marcas:**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/equipamentos/marcas` | Listar marcas |
| `POST` | `/equipamentos/marcas` | Criar marca |
| `PUT` | `/equipamentos/marcas/{id}` | Atualizar marca |
| `DELETE` | `/equipamentos/marcas/{id}` | Deletar marca |

---

### 🏥 Health Checks

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/health` | Health check básico | ❌ |
| `GET` | `/health/detailed` | Health check detalhado | ❌ |

---

### 📦 Padrões de Resposta

#### Sucesso

```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

#### Erro de Validação (422)

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

#### Erro de Autenticação (401)

```json
{
  "detail": "Could not validate credentials"
}
```

#### Erro de Permissão (403)

```json
{
  "detail": "Not enough permissions"
}
```

#### Erro Not Found (404)

```json
{
  "detail": "Resource not found"
}
```

---

### 🔒 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| `200` | OK - Sucesso |
| `201` | Created - Recurso criado |
| `204` | No Content - Sucesso sem conteúdo |
| `400` | Bad Request - Requisição inválida |
| `401` | Unauthorized - Não autenticado |
| `403` | Forbidden - Sem permissão |
| `404` | Not Found - Recurso não encontrado |
| `422` | Unprocessable Entity - Erro de validação |
| `500` | Internal Server Error - Erro do servidor |

---

### 📚 Documentação Interativa

A API possui documentação interativa (Swagger UI) disponível em:

**🔗 https://gestorhsapi.healthsafetytech.com/docs**

Recursos:
- Testar endpoints diretamente no navegador
- Ver schemas completos de request/response
- Exemplos de uso
- Autenticação integrada

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Docker

#### Build da Imagem

```bash
docker build -t gestorhs-sistema .
```

#### Executar Container

```bash
docker run -p 80:80 \
  -e VITE_API_URL=https://api.gestorhs.com/api/v1 \
  -e VITE_ENV=production \
  gestorhs-sistema
```

### Docker Compose

```bash
docker-compose up -d
```

### Easypanel

O projeto está configurado para deploy no Easypanel:

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`
   - `VITE_APP_NAME`
   - `VITE_APP_VERSION`
   - `VITE_ENV`
3. Deploy automático em cada push

**Documentação completa:** Veja [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🏗️ Arquitetura

### Context API

#### AuthContext

Gerencia autenticação e usuário logado:

```typescript
interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  updateUser: (user: Partial<User>) => void;
}
```

#### ThemeContext

Controla tema dark/light:

```typescript
interface ThemeContextData {
  darkMode: boolean;
  toggleDarkMode: () => void;
}
```

#### DashboardContext

Gerencia métricas do dashboard:

```typescript
interface DashboardContextData {
  metrics: DashboardMetrics | null;
  loading: boolean;
  refreshMetrics: () => Promise<void>;
}
```

### Rotas Protegidas

```typescript
// Proteção por autenticação
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Proteção por perfil (apenas admin)
<ProtectedRoute>
  <RequirePerfil perfis={['admin']}>
    <Usuarios />
  </RequirePerfil>
</ProtectedRoute>
```

### Padrões de Código

- **Componentes funcionais** com TypeScript
- **Custom hooks** para lógica reutilizável
- **Service layer** para API calls
- **Validação** com Zod schemas
- **Error handling** consistente
- **Loading states** em todas as operações assíncronas

---

## 🎨 Design System

### Paleta de Cores

```javascript
// tailwind.config.js
colors: {
  // Background
  darkBlue: '#0a192f',

  // Cards
  cardBg: '#2c3e50',
  cardHover: '#34495e',

  // Status
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',

  // Fases de OS
  fases: {
    solicitado: '#17a2b8',
    enviado: '#ffc107',
    recebido: '#28a745',
    calibracao: '#007bff',
    calibrado: '#6f42c1',
    retornando: '#fd7e14',
    entregue: '#28a745',
    cancelado: '#dc3545',
  }
}
```

### Componentes Base

- `Button` - Botões com variants (primary, secondary, danger, ghost)
- `Input` - Input com label, error e ícone
- `Select` - Select customizado
- `Badge` - Badges de status
- `Modal` - Modal reutilizável
- `Spinner` - Loading indicator
- `DataTable` - Tabela com paginação e ordenação

---

## 📊 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa ESLint |
| `npm run type-check` | Verifica tipos TypeScript |

---

## 📚 Documentação Adicional

- [Guia de Deploy](./DEPLOYMENT.md) - Deploy com Docker e Easypanel
- [Configuração de Ambiente](./ENV_SETUP.md) - Variáveis de ambiente
- [API Documentation](https://api.gestorhs.com/docs) - Documentação da API backend

---

## 🧪 Testes

```bash
# Executar testes
npm test

# Cobertura de testes
npm run test:coverage
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenções de Código

- Use **TypeScript** para tipagem estática
- Siga o **ESLint** configurado
- Componentes em **PascalCase**
- Hooks em **camelCase** começando com `use`
- Serviços em **camelCase** terminando com `.service.ts`

---

## 📝 Changelog

### v1.0.0 (2025-11-19)

- ✅ Sistema completo de autenticação com JWT
- ✅ Dashboard interativo com 7 métricas
- ✅ CRUD de Empresas (PJ/PF) com integração ViaCEP
- ✅ CRUD de Equipamentos com upload de mídia
- ✅ Workflow completo de Ordens de Serviço (8 fases)
- ✅ Sistema de Relatórios (PDF/Excel)
- ✅ Gestão de Usuários (4 perfis)
- ✅ Configurações (Categorias e Marcas)
- ✅ Dark mode
- ✅ Responsividade mobile/tablet/desktop
- ✅ Deploy com Docker e Nginx

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

## 👨‍💻 Autores

**Health Safety Tech**

- Website: [https://healthsafetytech.com](https://healthsafetytech.com)
- Email: contato@healthsafetytech.com

---

## 🙏 Agradecimentos

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- Toda a comunidade open source

---

<div align="center">

**[⬆ Voltar ao topo](#-gestorhs-sistema)**

Feito com ❤️ pela equipe Health Safety Tech

</div>
