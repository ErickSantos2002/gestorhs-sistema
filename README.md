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
