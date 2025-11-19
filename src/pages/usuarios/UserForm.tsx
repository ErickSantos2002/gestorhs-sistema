import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usuarioService } from '@/services';
import { Button, Input, Select, Spinner } from '@/components/common';
import { FileUpload } from '@/components/forms';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const userSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  login: z.string().min(3, 'Login deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional().or(z.literal('')),
  perfil: z.enum(['admin', 'gerente', 'tecnico', 'atendente']),
  ativo: z.enum(['S', 'N']),
});

type UserFormData = z.infer<typeof userSchema>;

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [avatarUrl, setAvatarUrl] = useState<string>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ativo: 'S',
      perfil: 'atendente',
    },
  });

  useEffect(() => {
    if (isEdit) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoadingData(true);
      const data = await usuarioService.getById(Number(id));

      setValue('nome', data.nome);
      setValue('login', data.login);
      setValue('email', data.email);
      setValue('perfil', data.perfil);
      setValue('ativo', data.ativo);
      setAvatarUrl(data.imagem);
    } catch (error) {
      toast.error('Erro ao carregar usuário');
      navigate('/usuarios');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);

      // Remove senha vazia se estiver editando
      const payload = { ...data };
      if (isEdit && !payload.senha) {
        delete payload.senha;
      }

      if (isEdit) {
        await usuarioService.update(Number(id), payload);
        toast.success('Usuário atualizado com sucesso');
      } else {
        await usuarioService.create(payload);
        toast.success('Usuário criado com sucesso');
      }

      navigate('/usuarios');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar usuário';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!isEdit) {
      toast.error('Salve o usuário primeiro para fazer upload de imagem');
      return;
    }

    try {
      const url = await usuarioService.uploadAvatar(Number(id), file);
      setAvatarUrl(url);
      toast.success('Imagem atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem');
      throw error;
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Spinner size="lg" />
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEdit ? 'Editar Usuário' : 'Novo Usuário'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEdit ? 'Atualize os dados do usuário' : 'Preencha os dados do novo usuário'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Dados do Usuário
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna esquerda - Formulário */}
            <div className="space-y-4">
              <Input
                label="Nome Completo"
                {...register('nome')}
                error={errors.nome?.message}
                required
              />

              <Input
                label="Login"
                {...register('login')}
                error={errors.login?.message}
                helperText="Usuário utilizará este login para acessar o sistema"
                required
              />

              <Input
                label="E-mail"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              <Input
                label={isEdit ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                type="password"
                {...register('senha')}
                error={errors.senha?.message}
                helperText="Mínimo 6 caracteres"
                required={!isEdit}
              />

              <Select
                label="Perfil"
                {...register('perfil')}
                error={errors.perfil?.message}
                options={[
                  { value: 'admin', label: 'Administrador' },
                  { value: 'gerente', label: 'Gerente' },
                  { value: 'tecnico', label: 'Técnico' },
                  { value: 'atendente', label: 'Atendente' },
                ]}
                helperText="Define as permissões do usuário no sistema"
                required
              />

              <Select
                label="Status"
                {...register('ativo')}
                error={errors.ativo?.message}
                options={[
                  { value: 'S', label: 'Ativo' },
                  { value: 'N', label: 'Inativo' },
                ]}
                required
              />
            </div>

            {/* Coluna direita - Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto do Usuário
              </label>

              <FileUpload
                accept="image/*"
                maxSize={5}
                onUpload={handleAvatarUpload}
                currentFile={avatarUrl}
                onRemove={handleRemoveAvatar}
                preview={true}
                disabled={!isEdit}
              />

              {!isEdit && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  💡 Salve o usuário primeiro para fazer upload da foto
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Descrição dos Perfis */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            ℹ️ Sobre os Perfis:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              <strong>Administrador:</strong> Acesso total ao sistema, incluindo gestão de usuários
            </li>
            <li>
              <strong>Gerente:</strong> Acesso a todas as funcionalidades exceto gestão de
              usuários
            </li>
            <li>
              <strong>Técnico:</strong> Gerencia ordens de serviço e calibrações
            </li>
            <li>
              <strong>Atendente:</strong> Acesso básico para consulta e criação de OS
            </li>
          </ul>
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate('/usuarios')}>
            Cancelar
          </Button>

          <Button type="submit" icon={<Save className="w-5 h-5" />} loading={loading}>
            {isEdit ? 'Atualizar' : 'Criar'} Usuário
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
