import React, { useState, useEffect } from 'react';
import { categoriaService } from '@/services';
import { Categoria } from '@/types';
import { DataTable, Column } from '@/components/table';
import { Button, Input, Badge, Modal } from '@/components/common';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { usePagination, useDebounce } from '@/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const categoriaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  ativo: z.enum(['S', 'N']),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

const CategoriasTab: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ativo, setAtivo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { page, size, total, setTotal, handlePageChange } = usePagination({
    initialSize: 20,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      ativo: 'S',
    },
  });

  useEffect(() => {
    loadCategorias();
  }, [page, size, debouncedSearch, ativo]);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.getAll({
        page,
        size,
        search: debouncedSearch,
        ativo,
      });
      setCategorias(data.items);
      setTotal(data.total);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      reset({
        nome: categoria.nome,
        descricao: categoria.descricao || '',
        ativo: categoria.ativo,
      });
    } else {
      setEditingCategoria(null);
      reset({
        nome: '',
        descricao: '',
        ativo: 'S',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
    reset();
  };

  const onSubmit = async (data: CategoriaFormData) => {
    try {
      if (editingCategoria) {
        await categoriaService.update(editingCategoria.id, data);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await categoriaService.create(data);
        toast.success('Categoria criada com sucesso!');
      }
      handleCloseModal();
      loadCategorias();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar categoria');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await categoriaService.delete(id);
      toast.success('Categoria excluída com sucesso!');
      loadCategorias();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir categoria');
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await categoriaService.toggleStatus(id);
      toast.success('Status atualizado com sucesso!');
      loadCategorias();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
      console.error(error);
    }
  };

  const columns: Column<Categoria>[] = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (categoria) => categoria.descricao || '-',
    },
    {
      key: 'ativo',
      label: 'Status',
      render: (categoria) => (
        <Badge variant={categoria.ativo === 'S' ? 'success' : 'danger'}>
          {categoria.ativo === 'S' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (categoria) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(categoria)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(categoria.id)}
          >
            {categoria.ativo === 'S' ? 'Desativar' : 'Ativar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(categoria.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header e Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={ativo}
            onChange={(e) => setAtivo(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-darkBlue dark:border-gray-700"
          >
            <option value="">Todos os status</option>
            <option value="S">Ativo</option>
            <option value="N">Inativo</option>
          </select>
        </div>

        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={categorias}
        loading={loading}
        pagination={{
          currentPage: page,
          pageSize: size,
          totalItems: total,
          onPageChange: handlePageChange,
        }}
      />

      {/* Modal de Criação/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('nome')}
              placeholder="Nome da categoria"
              error={errors.nome?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              {...register('descricao')}
              placeholder="Descrição da categoria"
              className="w-full px-3 py-2 border rounded-lg dark:bg-darkBlue dark:border-gray-700 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register('ativo')}
              className="w-full px-3 py-2 border rounded-lg dark:bg-darkBlue dark:border-gray-700"
            >
              <option value="S">Ativo</option>
              <option value="N">Inativo</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCategoria ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriasTab;
