import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { empresaService } from '@/services';
import { EmpresaFormData } from '@/types';
import { Button, Input, Select, Spinner } from '@/components/common';
import { ArrowLeft, Save } from 'lucide-react';
import { validateCPF, validateCNPJ, validateEmail } from '@/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

// Schema de validação
const empresaSchema = z.object({
  tipo_pessoa: z.enum(['PJ', 'PF']),
  cnpj_cpf: z.string().min(11, 'CPF/CNPJ inválido').refine((value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 11) return validateCPF(cleaned);
    if (cleaned.length === 14) return validateCNPJ(cleaned);
    return false;
  }, 'CPF/CNPJ inválido'),
  razao_social: z.string().min(3, 'Razão social é obrigatória'),
  nome_fantasia: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  cep: z.string().min(8, 'CEP é obrigatório'),
  logradouro: z.string().min(3, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'UF inválida'),
  telefone: z.string().min(10, 'Telefone é obrigatório'),
  celular: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Email inválido'),
  observacoes: z.string().optional(),
  status_contato: z.enum(['ativo', 'inativo', 'perdido']).optional(),
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;

const EmpresaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      tipo_pessoa: 'PJ',
      status_contato: 'ativo',
    },
  });

  const tipoPessoa = watch('tipo_pessoa');
  const cep = watch('cep');

  // Carregar empresa se estiver editando
  useEffect(() => {
    if (isEditing) {
      loadEmpresa();
    }
  }, [id]);

  const loadEmpresa = async () => {
    try {
      setLoading(true);
      const empresa = await empresaService.getById(Number(id));

      // Preencher formulário
      Object.keys(empresa).forEach((key) => {
        const value = empresa[key as keyof typeof empresa];

        // Converter tipo_pessoa do backend (J/F) para o formato do frontend (PJ/PF)
        if (key === 'tipo_pessoa') {
          setValue('tipo_pessoa', value === 'J' ? 'PJ' : 'PF');
        }
        // Backend retorna CPF/CNPJ em campos separados (cpf ou cnpj)
        else if (key === 'cpf' || key === 'cnpj') {
          if (value) {
            setValue('cnpj_cpf', value as string);
          }
        }
        else {
          setValue(key as any, value);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      toast.error('Erro ao carregar empresa');
      navigate('/empresas');
    } finally {
      setLoading(false);
    }
  };

  // Buscar CEP
  useEffect(() => {
    const cepCleaned = cep?.replace(/\D/g, '');

    if (cepCleaned?.length === 8) {
      searchCEP(cepCleaned);
    }
  }, [cep]);

  const searchCEP = async (cep: string) => {
    try {
      setLoadingCEP(true);
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (response.data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setValue('logradouro', response.data.logradouro);
      setValue('bairro', response.data.bairro);
      setValue('cidade', response.data.localidade);
      setValue('estado', response.data.uf);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoadingCEP(false);
    }
  };

  const onSubmit = async (data: EmpresaFormValues) => {
    try {
      setLoading(true);

      // Converter tipo_pessoa do formato do frontend (PJ/PF) para o backend (J/F)
      const dataToSend = {
        ...data,
        tipo_pessoa: data.tipo_pessoa === 'PJ' ? 'J' : 'F',
      };

      if (isEditing) {
        await empresaService.update(Number(id), dataToSend as any);
        toast.success('Empresa atualizada com sucesso');
      } else {
        await empresaService.create(dataToSend as any);
        toast.success('Empresa cadastrada com sucesso');
      }

      navigate('/empresas');
    } catch (error: any) {
      console.error('Erro ao salvar empresa:', error);
      const message = error.response?.data?.message || 'Erro ao salvar empresa';
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
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={() => navigate('/empresas')}
          className="mb-4"
        >
          Voltar
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Preencha os dados {tipoPessoa === 'PJ' ? 'da empresa' : 'do cliente'}
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Tipo de Pessoa */}
        <div className="mb-6">
          <Select
            label="Tipo de Pessoa"
            required
            {...register('tipo_pessoa')}
            error={errors.tipo_pessoa?.message}
            options={[
              { value: 'PJ', label: 'Pessoa Jurídica' },
              { value: 'PF', label: 'Pessoa Física' },
            ]}
          />
        </div>

        {/* Dados Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label={tipoPessoa === 'PJ' ? 'CNPJ' : 'CPF'}
            required
            {...register('cnpj_cpf')}
            error={errors.cnpj_cpf?.message}
            placeholder={tipoPessoa === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'}
          />

          <Input
            label={tipoPessoa === 'PJ' ? 'Razão Social' : 'Nome Completo'}
            required
            {...register('razao_social')}
            error={errors.razao_social?.message}
          />

          {tipoPessoa === 'PJ' && (
            <>
              <Input
                label="Nome Fantasia"
                {...register('nome_fantasia')}
                error={errors.nome_fantasia?.message}
              />

              <Input
                label="Inscrição Estadual"
                {...register('inscricao_estadual')}
                error={errors.inscricao_estadual?.message}
              />

              <Input
                label="Inscrição Municipal"
                {...register('inscricao_municipal')}
                error={errors.inscricao_municipal?.message}
              />
            </>
          )}
        </div>

        {/* Endereço */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Endereço
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Input
              label="CEP"
              required
              {...register('cep')}
              error={errors.cep?.message}
              placeholder="00000-000"
            />
            {loadingCEP && (
              <div className="absolute right-3 top-9">
                <Spinner size="sm" />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <Input
              label="Logradouro"
              required
              {...register('logradouro')}
              error={errors.logradouro?.message}
            />
          </div>

          <Input
            label="Número"
            required
            {...register('numero')}
            error={errors.numero?.message}
          />

          <Input
            label="Complemento"
            {...register('complemento')}
            error={errors.complemento?.message}
          />

          <Input
            label="Bairro"
            required
            {...register('bairro')}
            error={errors.bairro?.message}
          />

          <Input
            label="Cidade"
            required
            {...register('cidade')}
            error={errors.cidade?.message}
          />

          <Input
            label="UF"
            required
            {...register('estado')}
            error={errors.estado?.message}
            placeholder="SP"
            maxLength={2}
          />
        </div>

        {/* Contato */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Contato
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Telefone"
            required
            {...register('telefone')}
            error={errors.telefone?.message}
            placeholder="(00) 0000-0000"
          />

          <Input
            label="Celular"
            {...register('celular')}
            error={errors.celular?.message}
            placeholder="(00) 00000-0000"
          />

          <Input
            label="WhatsApp"
            {...register('whatsapp')}
            error={errors.whatsapp?.message}
            placeholder="(00) 00000-0000"
          />

          <Input
            label="Email"
            type="email"
            required
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        {/* Observações e Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observações
            </label>
            <textarea
              {...register('observacoes')}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Select
            label="Status de Contato"
            {...register('status_contato')}
            options={[
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
              { value: 'perdido', label: 'Perdido' },
            ]}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            type="submit"
            icon={<Save className="w-5 h-5" />}
            loading={loading}
          >
            {isEditing ? 'Atualizar' : 'Cadastrar'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/empresas')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmpresaForm;
