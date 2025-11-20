import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { equipamentoService, uploadService } from '@/services';
import { Categoria, Marca } from '@/types';
import { Button, Input, Select, Spinner } from '@/components/common';
import { FileUpload } from '@/components/forms/FileUpload';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const equipamentoSchema = z.object({
  categoria_id: z.number().min(1, 'Categoria é obrigatória'),
  marca_id: z.number().min(1, 'Marca é obrigatória'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  descricao: z.string().min(3, 'Descrição é obrigatória'),
  modelo: z.string().optional(),
  detalhes: z.string().optional(),
  especificacoes_tecnicas: z.string().optional(),
  periodo_calibracao_dias: z.number().min(1, 'Período de calibração é obrigatório'),
  preco_de: z.number().optional(),
  preco_por: z.number().optional(),
  custo: z.number().optional(),
  tags: z.string().optional(),
  ativo: z.string().optional(),
});

type EquipamentoFormValues = z.infer<typeof equipamentoSchema>;

const EquipamentoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [imagemUrl, setImagemUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EquipamentoFormValues>({
    resolver: zodResolver(equipamentoSchema),
  });

  useEffect(() => {
    loadAuxiliares();
    if (isEditing) {
      loadEquipamento();
    }
  }, [id]);

  const loadAuxiliares = async () => {
    try {
      const [categoriasData, marcasData] = await Promise.all([
        equipamentoService.listCategorias(),
        equipamentoService.listMarcas(),
      ]);
      setCategorias(categoriasData);
      setMarcas(marcasData);
    } catch (error) {
      toast.error('Erro ao carregar auxiliares');
    }
  };

  const loadEquipamento = async () => {
    try {
      setLoading(true);
      const equipamento = await equipamentoService.getById(Number(id));

      Object.keys(equipamento).forEach((key) => {
        setValue(key as any, equipamento[key as keyof typeof equipamento]);
      });

      if (equipamento.imagem) {
        setImagemUrl(equipamento.imagem);
      }
    } catch (error) {
      toast.error('Erro ao carregar equipamento');
      navigate('/equipamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadService.uploadFile(file, 'imagem');

      if (isEditing) {
        await equipamentoService.uploadImagem(Number(id), file);
      }

      setImagemUrl(result.url);
      toast.success('Imagem enviada com sucesso');
    } catch (error) {
      toast.error('Erro ao enviar imagem');
      throw error;
    }
  };

  const onSubmit = async (data: EquipamentoFormValues) => {
    try {
      setLoading(true);

      if (isEditing) {
        await equipamentoService.update(Number(id), data);
        toast.success('Equipamento atualizado com sucesso');
      } else {
        await equipamentoService.create(data);
        toast.success('Equipamento cadastrado com sucesso');
      }

      navigate('/equipamentos');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar equipamento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
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
        onClick={() => navigate('/equipamentos')}
        className="mb-4"
      >
        Voltar
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Categoria"
                required
                {...register('categoria_id', { valueAsNumber: true })}
                error={errors.categoria_id?.message}
                options={categorias.map((c) => ({ value: c.id, label: c.nome }))}
              />

              <Select
                label="Marca"
                required
                {...register('marca_id', { valueAsNumber: true })}
                error={errors.marca_id?.message}
                options={marcas.map((m) => ({ value: m.id, label: m.nome }))}
              />

              <Input
                label="Código"
                required
                {...register('codigo')}
                error={errors.codigo?.message}
              />

              <Input
                label="Modelo"
                {...register('modelo')}
                error={errors.modelo?.message}
              />

              <div className="md:col-span-2">
                <Input
                  label="Descrição"
                  required
                  {...register('descricao')}
                  error={errors.descricao?.message}
                />
              </div>

              <Input
                label="Período de Calibração (dias)"
                type="number"
                required
                {...register('periodo_calibracao_dias', { valueAsNumber: true })}
                error={errors.periodo_calibracao_dias?.message}
              />

              <Input
                label="Preço De"
                type="number"
                step="0.01"
                {...register('preco_de', { valueAsNumber: true })}
                error={errors.preco_de?.message}
              />

              <Input
                label="Preço Por"
                type="number"
                step="0.01"
                {...register('preco_por', { valueAsNumber: true })}
                error={errors.preco_por?.message}
              />

              <Input
                label="Custo"
                type="number"
                step="0.01"
                {...register('custo', { valueAsNumber: true })}
                error={errors.custo?.message}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Detalhes
                </label>
                <textarea
                  {...register('detalhes')}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Especificações Técnicas
                </label>
                <textarea
                  {...register('especificacoes_tecnicas')}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div>
            <FileUpload
              label="Imagem do Equipamento"
              accept="image/*"
              maxSize={5}
              onUpload={handleImageUpload}
              currentFile={imagemUrl}
              onRemove={() => setImagemUrl('')}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" icon={<Save className="w-5 h-5" />} loading={loading}>
            {isEditing ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/equipamentos')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EquipamentoForm;
