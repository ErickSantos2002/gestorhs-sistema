import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ordemServicoService } from '@/services';
import { OrdemServico, FaseOS, SituacaoOS } from '@/types';
import { DataTable, Column } from '@/components/table';
import { Button, Input, Select, StatusBadge } from '@/components/common';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils';
import toast from 'react-hot-toast';

const OSList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page, size, setPage } = usePagination(1, 20);

  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [fase, setFase] = useState<FaseOS | ''>(searchParams.get('fase') as FaseOS || '');
  const [situacao, setSituacao] = useState<SituacaoOS | ''>(
    searchParams.get('situacao') as SituacaoOS || ''
  );

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadOrdens();
  }, [debouncedSearch, fase, situacao, page]);

  const loadOrdens = async () => {
    try {
      setLoading(true);
      const response = await ordemServicoService.list({
        page,
        size,
        chave_acesso: debouncedSearch || undefined,
        fase: fase || undefined,
        situacao: situacao || undefined,
      });

      setOrdens(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Erro ao carregar ordens:', error);
      toast.error('Erro ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<OrdemServico>[] = [
    {
      key: 'chave_acesso',
      header: 'Chave de Acesso',
      render: (value) => (
        <span className="font-mono text-sm font-semibold">{value}</span>
      ),
    },
    {
      key: 'empresa',
      header: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.empresa?.razao_social}</div>
          {row.empresa?.nome_fantasia && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.empresa.nome_fantasia}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'equipamento_empresa',
      header: 'Equipamento',
      render: (_, row) => (
        <div className="text-sm">
          {row.equipamento_empresa?.equipamento?.descricao || '-'}
        </div>
      ),
    },
    {
      key: 'fase',
      header: 'Fase',
      render: (value) => <StatusBadge fase={value} />,
    },
    {
      key: 'situacao',
      header: 'Situação',
      render: (value) => <StatusBadge situacao={value} />,
    },
    {
      key: 'data_solicitacao',
      header: 'Data Solicitação',
      render: (value) => formatDate(value),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ordens de Serviço
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie as ordens de calibração
          </p>
        </div>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate('/ordens/nova')}
        >
          Nova Ordem
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Buscar por chave de acesso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          <Select
            value={fase}
            onChange={(e) => setFase(e.target.value as any)}
            options={[
              { value: '', label: 'Todas as fases' },
              { value: 'solicitado', label: 'Solicitado' },
              { value: 'enviado', label: 'Enviado' },
              { value: 'recebido', label: 'Recebido' },
              { value: 'calibracao', label: 'Em Calibração' },
              { value: 'calibrado', label: 'Calibrado' },
              { value: 'retornando', label: 'Retornando' },
              { value: 'entregue', label: 'Entregue' },
              { value: 'cancelado', label: 'Cancelado' },
            ]}
          />

          <Select
            value={situacao}
            onChange={(e) => setSituacao(e.target.value as any)}
            options={[
              { value: '', label: 'Todas as situações' },
              { value: 'aberta', label: 'Aberta' },
              { value: 'andamento', label: 'Em Andamento' },
              { value: 'concluida', label: 'Concluída' },
              { value: 'cancelada', label: 'Cancelada' },
            ]}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          data={ordens}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(`/ordens/${row.id}`)}
          pagination={{
            page,
            size,
            total,
            onPageChange: setPage,
          }}
          emptyMessage="Nenhuma ordem de serviço encontrada. Que tal criar a primeira?"
        />
      </div>
    </div>
  );
};

export default OSList;
