import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { relatorioService, empresaService, equipamentoService } from '@/services';
import { RelatorioCalibracoesData, Empresa, Equipamento } from '@/types';
import { Button, Input, Select, Spinner, ExportButtons, StatusBadge } from '@/components/common';
import { DataTable, Column } from '@/components/table';
import { ArrowLeft, Search } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';
import toast from 'react-hot-toast';

const RelatorioCalibracao: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<RelatorioCalibracoesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  // Filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [empresaId, setEmpresaId] = useState<number | ''>('');
  const [equipamentoId, setEquipamentoId] = useState<number | ''>('');
  const [situacao, setSituacao] = useState('');

  useEffect(() => {
    loadFilters();
    // Definir período padrão (últimos 30 dias)
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    setDataFim(hoje.toISOString().split('T')[0]);
    setDataInicio(trintaDiasAtras.toISOString().split('T')[0]);
  }, []);

  const loadFilters = async () => {
    try {
      const [empresasData, equipamentosData] = await Promise.all([
        empresaService.getAll({ page: 1, size: 1000 }),
        equipamentoService.getAll({ page: 1, size: 1000 }),
      ]);
      setEmpresas(empresasData.items);
      setEquipamentos(equipamentosData.items);
    } catch (error) {
      toast.error('Erro ao carregar filtros');
    }
  };

  const loadRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      toast.error('Informe o período');
      return;
    }

    try {
      setLoading(true);
      const result = await relatorioService.getCalibracao({
        data_inicio: dataInicio,
        data_fim: dataFim,
        empresa_id: empresaId || undefined,
        equipamento_id: equipamentoId || undefined,
        situacao: situacao || undefined,
      });
      setData(result);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const blob = await relatorioService.downloadCalibracao({
      data_inicio: dataInicio,
      data_fim: dataFim,
      empresa_id: empresaId || undefined,
      equipamento_id: equipamentoId || undefined,
      situacao: situacao || undefined,
      formato: 'pdf',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-calibracoes-${dataInicio}-${dataFim}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    const blob = await relatorioService.downloadCalibracao({
      data_inicio: dataInicio,
      data_fim: dataFim,
      empresa_id: empresaId || undefined,
      equipamento_id: equipamentoId || undefined,
      situacao: situacao || undefined,
      formato: 'excel',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-calibracoes-${dataInicio}-${dataFim}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns: Column<any>[] = [
    {
      key: 'chave_acesso',
      header: 'Chave Acesso',
      sortable: true,
    },
    {
      key: 'empresa',
      header: 'Cliente',
      sortable: true,
    },
    {
      key: 'equipamento',
      header: 'Equipamento',
      sortable: true,
    },
    {
      key: 'data_solicitacao',
      header: 'Data Solicitação',
      render: (value) => formatDate(value),
      sortable: true,
    },
    {
      key: 'data_entrega',
      header: 'Data Entrega',
      render: (value) => (value ? formatDate(value) : '-'),
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
      key: 'valor',
      header: 'Valor',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      <Button
        variant="ghost"
        icon={<ArrowLeft className="w-5 h-5" />}
        onClick={() => navigate('/relatorios')}
        className="mb-4"
      >
        Voltar
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Relatório de Calibrações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize ordens de serviço por período, cliente ou equipamento
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Input
            label="Data Início"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />

          <Input
            label="Data Fim"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />

          <Select
            label="Cliente"
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value ? Number(e.target.value) : '')}
            options={[
              { value: '', label: 'Todos' },
              ...empresas.map((e) => ({
                value: e.id,
                label: e.razao_social,
              })),
            ]}
          />

          <Select
            label="Equipamento"
            value={equipamentoId}
            onChange={(e) => setEquipamentoId(e.target.value ? Number(e.target.value) : '')}
            options={[
              { value: '', label: 'Todos' },
              ...equipamentos.map((e) => ({
                value: e.id,
                label: e.descricao,
              })),
            ]}
          />

          <Select
            label="Situação"
            value={situacao}
            onChange={(e) => setSituacao(e.target.value)}
            options={[
              { value: '', label: 'Todas' },
              { value: 'aberta', label: 'Aberta' },
              { value: 'em_andamento', label: 'Em Andamento' },
              { value: 'concluida', label: 'Concluída' },
              { value: 'cancelada', label: 'Cancelada' },
            ]}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button icon={<Search className="w-5 h-5" />} onClick={loadRelatorio} loading={loading}>
            Gerar Relatório
          </Button>

          {data && (
            <ExportButtons
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              disabled={!data.items.length}
            />
          )}
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data ? (
        <>
          {/* Cards de Totais */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Ordens</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.totais.total_ordens}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Concluídas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.totais.concluidas}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.totais.em_andamento}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Canceladas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.totais.canceladas}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(data.totais.valor_total)}
              </p>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <DataTable
              columns={columns}
              data={data.items}
              onRowClick={(row) => navigate(`/ordens/${row.chave_acesso}`)}
            />
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Selecione o período e clique em "Gerar Relatório"
          </p>
        </div>
      )}
    </div>
  );
};

export default RelatorioCalibracao;
