import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuarioService } from '@/services';
import { User } from '@/types';
import { Button, Spinner, Badge } from '@/components/common';
import { ArrowLeft, Edit, Trash2, Power, Key } from 'lucide-react';
import { formatDate } from '@/utils';
import toast from 'react-hot-toast';

const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getById(Number(id));
      setUser(data);
    } catch (error) {
      toast.error('Erro ao carregar usuário');
      navigate('/usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    const action = user.ativo === 'S' ? 'desativar' : 'ativar';
    if (!confirm(`Deseja realmente ${action} este usuário?`)) {
      return;
    }

    try {
      await usuarioService.toggleStatus(user.id);
      toast.success(`Usuário ${action === 'desativar' ? 'desativado' : 'ativado'} com sucesso`);
      loadUser();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    if (!confirm('Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await usuarioService.delete(user.id);
      toast.success('Usuário excluído com sucesso');
      navigate('/usuarios');
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    const novaSenha = prompt('Digite a nova senha (mínimo 6 caracteres):');

    if (!novaSenha) return;

    if (novaSenha.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      await usuarioService.changePassword(user.id, novaSenha);
      toast.success('Senha alterada com sucesso');
    } catch (error) {
      toast.error('Erro ao alterar senha');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  const perfilMap: Record<string, { label: string; variant: any }> = {
    admin: { label: 'Administrador', variant: 'danger' },
    gerente: { label: 'Gerente', variant: 'warning' },
    tecnico: { label: 'Técnico', variant: 'info' },
    atendente: { label: 'Atendente', variant: 'secondary' },
  };

  const perfilInfo = perfilMap[user.perfil] || { label: user.perfil, variant: 'secondary' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      <Button
        variant="ghost"
        icon={<ArrowLeft className="w-5 h-5" />}
        onClick={() => navigate('/usuarios')}
        className="mb-4"
      >
        Voltar
      </Button>

      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {user.imagem ? (
              <img
                src={user.imagem}
                alt={user.nome}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                  {user.nome.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.nome}
              </h1>
              <div className="flex gap-2">
                <Badge variant={perfilInfo.variant}>{perfilInfo.label}</Badge>
                <Badge variant={user.ativo === 'S' ? 'success' : 'danger'}>
                  {user.ativo === 'S' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              icon={<Edit className="w-5 h-5" />}
              onClick={() => navigate(`/usuarios/${user.id}/editar`)}
            >
              Editar
            </Button>

            <Button
              variant="warning"
              icon={<Key className="w-5 h-5" />}
              onClick={handleChangePassword}
            >
              Alterar Senha
            </Button>

            <Button
              variant={user.ativo === 'S' ? 'warning' : 'success'}
              icon={<Power className="w-5 h-5" />}
              onClick={handleToggleStatus}
            >
              {user.ativo === 'S' ? 'Desativar' : 'Ativar'}
            </Button>

            <Button variant="danger" icon={<Trash2 className="w-5 h-5" />} onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informações do Usuário
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nome Completo</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {user.nome}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Login</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {user.login}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">E-mail</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Perfil</p>
                <Badge variant={perfilInfo.variant}>{perfilInfo.label}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <Badge variant={user.ativo === 'S' ? 'success' : 'danger'}>
                  {user.ativo === 'S' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Permissões do Perfil */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Permissões
            </h2>

            {user.perfil === 'admin' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Acesso total ao sistema
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Gerenciar usuários
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Gerenciar empresas e equipamentos
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Gerenciar ordens de serviço
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Visualizar e exportar relatórios
                </p>
              </div>
            )}

            {user.perfil === 'gerente' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Gerenciar empresas e equipamentos
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Gerenciar ordens de serviço
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Visualizar e exportar relatórios
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ❌ Não pode gerenciar usuários
                </p>
              </div>
            )}

            {user.perfil === 'tecnico' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Gerenciar ordens de serviço
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Finalizar calibrações
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Visualizar empresas e equipamentos
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ❌ Acesso limitado a relatórios
                </p>
              </div>
            )}

            {user.perfil === 'atendente' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Visualizar dashboard
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Criar ordens de serviço
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Visualizar empresas e equipamentos
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ❌ Não pode editar ou excluir
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Datas */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informações do Sistema
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Criado em</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(user.created_at)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Última atualização</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(user.updated_at)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ID do Usuário</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">#{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
