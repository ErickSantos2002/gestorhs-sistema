import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/common';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Bloqueio from './pages/Bloqueio';

// Empresas
import { EmpresasList, EmpresaForm, EmpresaDetails } from './pages/empresas';

// Equipamentos
import { EquipamentosList, EquipamentoForm, EquipamentoDetails } from './pages/equipamentos';

// Ordens de Serviço
import { OSList, OSForm, OSDetails } from './pages/ordens-servico';

// Relatórios
import {
  RelatoriosList,
  RelatorioCalibracao,
  RelatorioEquipamentos,
  RelatorioFinanceiro,
} from './pages/relatorios';

// Componente de proteção de rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente de verificação de perfil
interface RequirePerfilProps {
  children: React.ReactNode;
  perfis: string[];
}

const RequirePerfil: React.FC<RequirePerfilProps> = ({ children, perfis }) => {
  const { user, loading, isPerfil } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !isPerfil(perfis)) {
    return <Bloqueio />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Rota pública */}
    <Route path="/login" element={<Login />} />

    {/* Rotas protegidas */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Navigate to="/dashboard" replace />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Empresas - Todos podem acessar */}
    <Route
      path="/empresas"
      element={
        <ProtectedRoute>
          <EmpresasList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/empresas/novo"
      element={
        <ProtectedRoute>
          <EmpresaForm />
        </ProtectedRoute>
      }
    />

    <Route
      path="/empresas/:id"
      element={
        <ProtectedRoute>
          <EmpresaDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/empresas/:id/editar"
      element={
        <ProtectedRoute>
          <EmpresaForm />
        </ProtectedRoute>
      }
    />

    {/* Equipamentos - Todos podem acessar */}
    <Route
      path="/equipamentos"
      element={
        <ProtectedRoute>
          <EquipamentosList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/equipamentos/novo"
      element={
        <ProtectedRoute>
          <EquipamentoForm />
        </ProtectedRoute>
      }
    />

    <Route
      path="/equipamentos/:id"
      element={
        <ProtectedRoute>
          <EquipamentoDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/equipamentos/:id/editar"
      element={
        <ProtectedRoute>
          <EquipamentoForm />
        </ProtectedRoute>
      }
    />

    {/* Ordens de Serviço - Todos podem acessar */}
    <Route
      path="/ordens"
      element={
        <ProtectedRoute>
          <OSList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/ordens/nova"
      element={
        <ProtectedRoute>
          <OSForm />
        </ProtectedRoute>
      }
    />

    <Route
      path="/ordens/:id"
      element={
        <ProtectedRoute>
          <OSDetails />
        </ProtectedRoute>
      }
    />

    {/* Relatórios - Todos podem acessar */}
    <Route
      path="/relatorios"
      element={
        <ProtectedRoute>
          <RelatoriosList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/relatorios/calibracoes"
      element={
        <ProtectedRoute>
          <RelatorioCalibracao />
        </ProtectedRoute>
      }
    />

    <Route
      path="/relatorios/equipamentos"
      element={
        <ProtectedRoute>
          <RelatorioEquipamentos />
        </ProtectedRoute>
      }
    />

    <Route
      path="/relatorios/financeiro"
      element={
        <ProtectedRoute>
          <RelatorioFinanceiro />
        </ProtectedRoute>
      }
    />

    {/* Configurações - Apenas admin */}
    <Route
      path="/configuracoes/*"
      element={
        <ProtectedRoute>
          <RequirePerfil perfis={['admin']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold">Configurações (em breve)</h1>
            </div>
          </RequirePerfil>
        </ProtectedRoute>
      }
    />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
