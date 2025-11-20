import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { empresaService } from '@/services';
import { Empresa } from '@/types';
import { DataTable, Column } from '@/components/table';
import { Button, Input, Select, Badge } from '@/components/common';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { formatCPFCNPJ, formatPhone } from '@/utils';
import toast from 'react-hot-toast';

const EmpresasList: React.FC = () => {
  const navigate = useNavigate();
  const { page, size, setPage } = usePagination(1, 20);

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState<'PJ' | 'PF' | ''>('');
  const [statusContato, setStatusContato] = useState<'ativo' | 'inativo' | 'perdido' | ''>('');

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadEmpresas();
  }, [debouncedSearch, tipoPessoa, statusContato, page]);

  const loadEmpresas = async () => {
    try {
      setLoading(true);

      // Converter tipo_pessoa do frontend (PJ/PF) para backend (J/F)
      const tipoPessoaBackend = tipoPessoa === 'PJ' ? 'J' : tipoPessoa === 'PF' ? 'F' : undefined;

      const response = await empresaService.list({
        page,
        size,
        razao_social: debouncedSearch || undefined,
        tipo_pessoa: tipoPessoaBackend as any,
        status_contato: statusContato || undefined,
      });

      setEmpresas(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, razaoSocial: string) => {
    if (!confirm(`Deseja realmente excluir a empresa "${razaoSocial}"?`)) {
      return;
    }

    try {
      await empresaService.delete(id);
      toast.success('Empresa excluída com sucesso');
      loadEmpresas();
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error('Erro ao excluir empresa');
    }
  };

  const columns: Column<Empresa>[] = [
    {
      key: 'tipo_pessoa',
      header: 'Tipo',
      width: 'w-20',
      render: (value) => {
        // Converter tipo_pessoa do backend (J/F) para exibição (PJ/PF)
        const displayValue = value === 'J' ? 'PJ' : value === 'F' ? 'PF' : value;
        return (
          <Badge variant={displayValue === 'PJ' ? 'info' : 'secondary'} size="sm">
            {displayValue}
          </Badge>
        );
      },
    },
    {
      key: 'razao_social',
      header: 'Razão Social',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.nome_fantasia && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.nome_fantasia}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'cnpj_cpf',
      header: 'CPF/CNPJ',
      render: (value) => formatCPFCNPJ(value),
    },
    {
      key: 'telefone',
      header: 'Telefone',
      render: (value) => formatPhone(value),
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'status_contato',
      header: 'Status',
      render: (value) => {
        const variants = {
          ativo: 'success' as const,
          inativo: 'secondary' as const,
          perdido: 'danger' as const,
        };

        const labels = {
          ativo: 'Ativo',
          inativo: 'Inativo',
          perdido: 'Perdido',
        };

        return (
          <Badge variant={variants[value]} size="sm">
            {labels[value]}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      width: 'w-48',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<Eye className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/empresas/${row.id}`);
            }}
          >
            Ver
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/empresas/${row.id}/editar`);
            }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id, row.razao_social);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Empresas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus clientes
          </p>
        </div>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate('/empresas/novo')}
        >
          Nova Empresa
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Input
              type="text"
              placeholder="Buscar por razão social..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          <Select
            value={tipoPessoa}
            onChange={(e) => setTipoPessoa(e.target.value as any)}
            options={[
              { value: '', label: 'Todos os tipos' },
              { value: 'PJ', label: 'Pessoa Jurídica' },
              { value: 'PF', label: 'Pessoa Física' },
            ]}
          />

          <Select
            value={statusContato}
            onChange={(e) => setStatusContato(e.target.value as any)}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
              { value: 'perdido', label: 'Perdido' },
            ]}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          data={empresas}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(`/empresas/${row.id}`)}
          pagination={{
            page,
            size,
            total,
            onPageChange: setPage,
          }}
          emptyMessage="Nenhuma empresa encontrada. Que tal cadastrar a primeira?"
        />
      </div>
    </div>
  );
};

export default EmpresasList;
