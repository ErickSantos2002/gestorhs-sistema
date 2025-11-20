import React, { useState, useEffect } from 'react';
import { marcaService } from '@/services';
import { Marca } from '@/types';
import { DataTable, Column } from '@/components/table';
import { Button, Input, Badge, Modal } from '@/components/common';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { usePagination, useDebounce } from '@/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const marcaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  ativo: z.enum(['S', 'N']),
});

type MarcaFormData = z.infer<typeof marcaSchema>;

const MarcasTab: React.FC = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ativo, setAtivo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { page, size, total, setTotal, handlePageChange } = usePagination({
    initialSize: 20,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarcaFormData>({
    resolver: zodResolver(marcaSchema),
    defaultValues: {
      ativo: 'S',
    },
  });

  useEffect(() => {
    loadMarcas();
  }, [page, size, debouncedSearch, ativo]);

  const loadMarcas = async () => {
    try {
      setLoading(true);
      const data = await marcaService.getAll({
        page,
        size,
        search: debouncedSearch,
        ativo,
      });
      setMarcas(data.items);
      setTotal(data.total);
    } catch (error) {
      toast.error('Erro ao carregar marcas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (marca?: Marca) => {
    if (marca) {
      setEditingMarca(marca);
      reset({
        nome: marca.nome,
        descricao: marca.descricao || '',
        ativo: marca.ativo,
      });
    } else {
      setEditingMarca(null);
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
    setEditingMarca(null);
    reset();
  };

  const onSubmit = async (data: MarcaFormData) => {
    try {
      if (editingMarca) {
        await marcaService.update(editingMarca.id, data);
        toast.success('Marca atualizada com sucesso!');
      } else {
        await marcaService.create(data);
        toast.success('Marca criada com sucesso!');
      }
      handleCloseModal();
      loadMarcas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar marca');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta marca?')) return;

    try {
      await marcaService.delete(id);
      toast.success('Marca excluída com sucesso!');
      loadMarcas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir marca');
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await marcaService.toggleStatus(id);
      toast.success('Status atualizado com sucesso!');
      loadMarcas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
      console.error(error);
    }
  };

  const columns: Column<Marca>[] = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (value, marca) => marca.descricao || '-',
    },
    {
      key: 'ativo',
      label: 'Status',
      render: (value, marca) => (
        <Badge variant={marca.ativo === 'S' ? 'success' : 'danger'}>
          {marca.ativo === 'S' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, marca) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(marca)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(marca.id)}
          >
            {marca.ativo === 'S' ? 'Desativar' : 'Ativar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(marca.id)}
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
          Nova Marca
        </Button>
      </div>

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={marcas}
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
        title={editingMarca ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('nome')}
              placeholder="Nome da marca"
              error={errors.nome?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              {...register('descricao')}
              placeholder="Descrição da marca"
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
              {editingMarca ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MarcasTab;
