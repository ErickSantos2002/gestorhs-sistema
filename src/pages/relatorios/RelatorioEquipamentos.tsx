import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { relatorioService } from '@/services';
import { RelatorioEquipamentosData } from '@/types';
import { Button, Select, Spinner, ExportButtons } from '@/components/common';
import { DataTable, Column } from '@/components/table';
import { ArrowLeft, Search } from 'lucide-react';
import { formatCurrency } from '@/utils';
import toast from 'react-hot-toast';

const RelatorioEquipamentos: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<RelatorioEquipamentosData | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [marcaId, setMarcaId] = useState<number | ''>('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Carregar dados automaticamente
    loadRelatorio();
  }, []);

  const loadRelatorio = async () => {
    try {
      setLoading(true);
      const result = await relatorioService.getEquipamentos({
        categoria_id: categoriaId || undefined,
        marca_id: marcaId || undefined,
        status: status || undefined,
      });
      setData(result);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const blob = await relatorioService.downloadEquipamentos({
      categoria_id: categoriaId || undefined,
      marca_id: marcaId || undefined,
      status: status || undefined,
      formato: 'pdf',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-equipamentos-${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    const blob = await relatorioService.downloadEquipamentos({
      categoria_id: categoriaId || undefined,
      marca_id: marcaId || undefined,
      status: status || undefined,
      formato: 'excel',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-equipamentos-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns: Column<any>[] = [
    {
      key: 'categoria',
      header: 'Categoria',
      sortable: true,
    },
    {
      key: 'marca',
      header: 'Marca',
      sortable: true,
    },
    {
      key: 'descricao',
      header: 'Descrição',
      sortable: true,
    },
    {
      key: 'total_cadastrados',
      header: 'Total Cadastrados',
      render: (value) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">{value}</span>
      ),
      sortable: true,
    },
    {
      key: 'total_empresas',
      header: 'Empresas com Equipamento',
      render: (value) => (
        <span className="font-semibold text-green-600 dark:text-green-400">{value}</span>
      ),
      sortable: true,
    },
    {
      key: 'preco_medio',
      header: 'Preço Médio',
      render: (value) => (
        <span className="font-semibold text-purple-600 dark:text-purple-400">
          {formatCurrency(value)}
        </span>
      ),
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
          Relatório de Equipamentos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Análise de equipamentos cadastrados por categoria e marca
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
            options={[{ value: '', label: 'Todas' }]}
          />

          <Select
            label="Marca"
            value={marcaId}
            onChange={(e) => setMarcaId(e.target.value ? Number(e.target.value) : '')}
            options={[{ value: '', label: 'Todas' }]}
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: '', label: 'Todos' },
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
            ]}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button icon={<Search className="w-5 h-5" />} onClick={loadRelatorio} loading={loading}>
            Atualizar Relatório
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total de Equipamentos</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {data.totais.total_equipamentos}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total de Categorias</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {data.totais.total_categorias}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total de Marcas</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {data.totais.total_marcas}
              </p>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <DataTable columns={columns} data={data.items} />

            {data.items.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum equipamento encontrado com os filtros selecionados
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default RelatorioEquipamentos;
