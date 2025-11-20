import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipamentoService } from '@/services';
import { Equipamento, Categoria, Marca } from '@/types';
import { EquipamentoCard, Button, Input, Select, Spinner, EmptyState } from '@/components/common';
import { Plus, Search, Settings } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/table';
import toast from 'react-hot-toast';

const EquipamentosList: React.FC = () => {
  const navigate = useNavigate();
  const { page, size, setPage } = usePagination(1, 12);

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [marcaId, setMarcaId] = useState<number | ''>('');
  const [ativo, setAtivo] = useState<'S' | 'N' | ''>('');

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadAuxiliares();
  }, []);

  useEffect(() => {
    loadEquipamentos();
  }, [debouncedSearch, categoriaId, marcaId, ativo, page]);

  const loadAuxiliares = async () => {
    try {
      const [categoriasData, marcasData] = await Promise.all([
        equipamentoService.listCategorias(),
        equipamentoService.listMarcas(),
      ]);

      setCategorias(categoriasData);
      setMarcas(marcasData);
    } catch (error) {
      console.error('Erro ao carregar auxiliares:', error);
    }
  };

  const loadEquipamentos = async () => {
    try {
      setLoading(true);
      const response = await equipamentoService.list({
        page,
        size,
        descricao: debouncedSearch || undefined,
        categoria_id: categoriaId || undefined,
        marca_id: marcaId || undefined,
        ativo: ativo || undefined,
      });

      setEquipamentos(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      toast.error('Erro ao carregar equipamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, descricao: string) => {
    if (!confirm(`Deseja realmente excluir o equipamento "${descricao}"?`)) {
      return;
    }

    try {
      await equipamentoService.delete(id);
      toast.success('Equipamento excluído com sucesso');
      loadEquipamentos();
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
      toast.error('Erro ao excluir equipamento');
    }
  };

  const totalPages = Math.ceil(total / size);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Equipamentos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Catálogo de produtos para calibração
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<Settings className="w-5 h-5" />}
            onClick={() => navigate('/equipamentos/configuracoes')}
          >
            Categorias e Marcas
          </Button>
          <Button
            icon={<Plus className="w-5 h-5" />}
            onClick={() => navigate('/equipamentos/novo')}
          >
            Novo Equipamento
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Input
              type="text"
              placeholder="Buscar por descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          <Select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
            options={[
              { value: '', label: 'Todas as categorias' },
              ...categorias.map((c) => ({ value: c.id, label: c.nome })),
            ]}
          />

          <Select
            value={marcaId}
            onChange={(e) => setMarcaId(e.target.value ? Number(e.target.value) : '')}
            options={[
              { value: '', label: 'Todas as marcas' },
              ...marcas.map((m) => ({ value: m.id, label: m.nome })),
            ]}
          />

          <Select
            value={ativo}
            onChange={(e) => setAtivo(e.target.value as any)}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'S', label: 'Ativo' },
              { value: 'N', label: 'Inativo' },
            ]}
          />
        </div>
      </div>

      {/* Grid de Equipamentos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : equipamentos.length === 0 ? (
        <EmptyState
          title="Nenhum equipamento encontrado"
          message="Que tal cadastrar o primeiro equipamento do catálogo?"
          action={{
            label: 'Novo Equipamento',
            onClick: () => navigate('/equipamentos/novo'),
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {equipamentos.map((equipamento) => (
              <EquipamentoCard
                key={equipamento.id}
                equipamento={equipamento}
                onClick={() => navigate(`/equipamentos/${equipamento.id}`)}
                onEdit={() => navigate(`/equipamentos/${equipamento.id}/editar`)}
                onDelete={() => handleDelete(equipamento.id, equipamento.descricao)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EquipamentosList;
