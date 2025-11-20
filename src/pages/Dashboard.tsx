import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService, ordemServicoService } from '@/services';
import { DashboardMetrics } from '@/types';
import { MetricCard } from '@/components/dashboard';
import { Spinner, Input } from '@/components/common';
import {
  Wrench,
  Frown,
  Calendar,
  Play,
  ThumbsUp,
  Ban,
  BellOff,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error('Digite o número da Ordem de Serviço');
      return;
    }

    try {
      setSearching(true);
      const os = await ordemServicoService.getByChaveAcesso(searchQuery.trim());
      navigate(`/ordens/${os.id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Ordem de Serviço não encontrada');
      } else {
        toast.error('Erro ao buscar Ordem de Serviço');
      }
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bem-vindo, <span className="font-semibold">{user?.nome}</span>
        </p>
      </div>

      {/* Busca de OS */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl">
          <Input
            type="text"
            placeholder="Informe o número da Ordem de Serviço"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            disabled={searching}
          />
          <button
            type="submit"
            disabled={searching}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {/* Grid de Métricas */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <MetricCard
            icon={<Wrench />}
            title="Andamento"
            value={metrics.ordens_andamento}
            subtitle="Ordens"
            color="blue"
            onClick={() => navigate('/ordens?situacao=andamento')}
          />

          <MetricCard
            icon={<Frown />}
            title="Atrasados"
            value={metrics.clientes_atrasados}
            subtitle="Clientes"
            color="red"
          />

          <MetricCard
            icon={<Calendar />}
            title="Atrasadas"
            value={metrics.calibracoes_atrasadas}
            subtitle="Calibragens"
            color="red"
          />

          <MetricCard
            icon={<Play />}
            title="Próximas"
            value={metrics.calibracoes_proximas}
            subtitle="Calibrações"
            color="yellow"
          />

          <MetricCard
            icon={<ThumbsUp />}
            title="Finalizadas"
            value={metrics.ordens_finalizadas_30dias}
            subtitle="Últimos 30 dias"
            color="green"
            onClick={() => navigate('/ordens?situacao=concluida')}
          />

          <MetricCard
            icon={<Ban />}
            title="Não vai Fazer"
            value={metrics.calibracoes_nao_fazer}
            subtitle="Calibragens"
            color="gray"
          />

          <MetricCard
            icon={<BellOff />}
            title="Perdidos"
            value={metrics.clientes_perdidos}
            subtitle="Sem contato"
            color="orange"
          />
        </div>
      )}

      {/* Rodapé com info */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 <strong>Dica:</strong> Clique nos cards "Andamento" e "Finalizadas" para ver as ordens filtradas.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
