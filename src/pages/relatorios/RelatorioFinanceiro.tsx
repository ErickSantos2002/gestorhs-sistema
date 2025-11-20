import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { relatorioService } from '@/services';
import { RelatorioFinanceiroData } from '@/types';
import { Button, Input, Select, Spinner, ExportButtons } from '@/components/common';
import { DataTable, Column } from '@/components/table';
import { ArrowLeft, Search, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const RelatorioFinanceiro: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<RelatorioFinanceiroData | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [agruparPor, setAgruparPor] = useState<'mes' | 'cliente' | 'equipamento'>('mes');

  useEffect(() => {
    // Definir período padrão (últimos 6 meses)
    const hoje = new Date();
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(hoje.getMonth() - 6);

    setDataFim(hoje.toISOString().split('T')[0]);
    setDataInicio(seisMesesAtras.toISOString().split('T')[0]);
  }, []);

  const loadRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      toast.error('Informe o período');
      return;
    }

    try {
      setLoading(true);
      const result = await relatorioService.getFinanceiro({
        data_inicio: dataInicio,
        data_fim: dataFim,
        agrupar_por: agruparPor,
      });
      setData(result);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const blob = await relatorioService.downloadFinanceiro({
      data_inicio: dataInicio,
      data_fim: dataFim,
      agrupar_por: agruparPor,
      formato: 'pdf',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${dataInicio}-${dataFim}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    const blob = await relatorioService.downloadFinanceiro({
      data_inicio: dataInicio,
      data_fim: dataFim,
      agrupar_por: agruparPor,
      formato: 'excel',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${dataInicio}-${dataFim}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns: Column<any>[] = [
    {
      key: 'periodo',
      header: agruparPor === 'mes' ? 'Período' : agruparPor === 'cliente' ? 'Cliente' : 'Equipamento',
      sortable: true,
    },
    {
      key: 'total_ordens',
      header: 'Quantidade de OS',
      render: (value) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">{value}</span>
      ),
      sortable: true,
    },
    {
      key: 'valor_total',
      header: 'Valor Total',
      render: (value) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(value)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'ticket_medio',
      header: 'Ticket Médio',
      render: (value) => (
        <span className="font-semibold text-purple-600 dark:text-purple-400">
          {formatCurrency(value)}
        </span>
      ),
      sortable: true,
    },
  ];

  // Preparar dados para o gráfico
  const chartData = data
    ? data.grafico.labels.map((label, index) => ({
        name: label,
        valor: data.grafico.valores[index],
      }))
    : [];

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
          Relatório Financeiro
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Análise de faturamento e desempenho financeiro
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            label="Agrupar Por"
            value={agruparPor}
            onChange={(e) => setAgruparPor(e.target.value as 'mes' | 'cliente' | 'equipamento')}
            options={[
              { value: 'mes', label: 'Mês' },
              { value: 'cliente', label: 'Cliente' },
              { value: 'equipamento', label: 'Equipamento' },
            ]}
          />

          <div className="flex items-end">
            <Button
              icon={<Search className="w-5 h-5" />}
              onClick={loadRelatorio}
              loading={loading}
              className="w-full"
            >
              Gerar Relatório
            </Button>
          </div>
        </div>

        {data && (
          <div className="flex gap-3 mt-4">
            <ExportButtons
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              disabled={!data.items.length}
            />
          </div>
        )}
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data ? (
        <>
          {/* Cards de Totais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total de Ordens</p>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {data.totais.total_ordens}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total</p>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data.totais.valor_total)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Médio</p>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(data.totais.ticket_medio)}
              </p>
            </div>
          </div>

          {/* Gráfico */}
          {chartData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Evolução do Faturamento
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="valor" fill="#8B5CF6" name="Valor Total" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tabela */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <DataTable columns={columns} data={data.items} />

            {data.items.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum dado financeiro encontrado no período selecionado
                </p>
              </div>
            )}
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

export default RelatorioFinanceiro;
