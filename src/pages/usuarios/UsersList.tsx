import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '@/services';
import { User } from '@/types';
import { DataTable, Column } from '@/components/table';
import { Button, Input, Select, Badge } from '@/components/common';
import { Plus, Search } from 'lucide-react';
import { usePagination, useDebounce } from '@/hooks';
import toast from 'react-hot-toast';

const UsersList: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [perfil, setPerfil] = useState('');
  const [ativo, setAtivo] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { page, size, total, setTotal, handlePageChange } = usePagination({
    initialSize: 20,
  });

  useEffect(() => {
    loadUsers();
  }, [page, size, debouncedSearch, perfil, ativo]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll({
        page,
        size,
        search: debouncedSearch || undefined,
        perfil: perfil || undefined,
        ativo: ativo || undefined,
      });

      setUsers(data.items);
      setTotal(data.total);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este usuário?')) {
      return;
    }

    try {
      await usuarioService.delete(id);
      toast.success('Usuário excluído com sucesso');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await usuarioService.toggleStatus(id);
      toast.success('Status alterado com sucesso');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'nome',
      header: 'Nome',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.imagem ? (
            <img
              src={row.imagem}
              alt={value}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {value.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      ),
    },
    {
      key: 'login',
      header: 'Login',
      sortable: true,
    },
    {
      key: 'email',
      header: 'E-mail',
      sortable: true,
    },
    {
      key: 'perfil',
      header: 'Perfil',
      sortable: true,
      render: (value) => {
        const perfilMap: Record<string, { label: string; variant: any }> = {
          admin: { label: 'Administrador', variant: 'danger' },
          gerente: { label: 'Gerente', variant: 'warning' },
          tecnico: { label: 'Técnico', variant: 'info' },
          atendente: { label: 'Atendente', variant: 'secondary' },
        };

        const perfil = perfilMap[value] || { label: value, variant: 'secondary' };

        return <Badge variant={perfil.variant}>{perfil.label}</Badge>;
      },
    },
    {
      key: 'ativo',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'S' ? 'success' : 'danger'}>
          {value === 'S' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'Ações',
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/usuarios/${value}`)}
          >
            Ver
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/usuarios/${value}/editar`)}
          >
            Editar
          </Button>

          <Button
            size="sm"
            variant={row.ativo === 'S' ? 'warning' : 'success'}
            onClick={() => handleToggleStatus(value)}
          >
            {row.ativo === 'S' ? 'Desativar' : 'Ativar'}
          </Button>

          <Button size="sm" variant="danger" onClick={() => handleDelete(value)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Usuários
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os usuários do sistema
          </p>
        </div>

        <Button icon={<Plus className="w-5 h-5" />} onClick={() => navigate('/usuarios/novo')}>
          Novo Usuário
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar por nome, login ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />

          <Select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            options={[
              { value: '', label: 'Todos os perfis' },
              { value: 'admin', label: 'Administrador' },
              { value: 'gerente', label: 'Gerente' },
              { value: 'tecnico', label: 'Técnico' },
              { value: 'atendente', label: 'Atendente' },
            ]}
          />

          <Select
            value={ativo}
            onChange={(e) => setAtivo(e.target.value)}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'S', label: 'Ativos' },
              { value: 'N', label: 'Inativos' },
            ]}
          />

          <Button
            variant="secondary"
            onClick={() => {
              setSearch('');
              setPerfil('');
              setAtivo('');
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          pagination={{
            page,
            size,
            total,
            onPageChange: handlePageChange,
          }}
          onRowClick={(row) => navigate(`/usuarios/${row.id}`)}
        />
      </div>
    </div>
  );
};

export default UsersList;
