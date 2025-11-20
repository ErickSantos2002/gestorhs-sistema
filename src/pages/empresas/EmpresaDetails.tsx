import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { empresaService } from '@/services';
import { Empresa } from '@/types';
import { Button, Spinner, Badge } from '@/components/common';
import { ArrowLeft, Edit, Trash2, Building2 } from 'lucide-react';
import { formatCPFCNPJ, formatPhone, formatDate } from '@/utils';
import toast from 'react-hot-toast';

const EmpresaDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmpresa();
  }, [id]);

  const loadEmpresa = async () => {
    try {
      setLoading(true);
      const data = await empresaService.getById(Number(id));
      setEmpresa(data);
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      toast.error('Erro ao carregar empresa');
      navigate('/empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!empresa) return;

    if (!confirm(`Deseja realmente excluir a empresa "${empresa.razao_social}"?`)) {
      return;
    }

    try {
      await empresaService.delete(empresa.id);
      toast.success('Empresa excluída com sucesso');
      navigate('/empresas');
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error('Erro ao excluir empresa');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!empresa) {
    return null;
  }

  const InfoItem = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;

    return (
      <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{value}</dd>
      </div>
    );
  };

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

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {empresa.razao_social}
              </h1>
              {empresa.nome_fantasia && (
                <p className="text-gray-600 dark:text-gray-400">
                  {empresa.nome_fantasia}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <Badge variant={empresa.tipo_pessoa === 'PJ' ? 'info' : 'secondary'}>
                  {empresa.tipo_pessoa}
                </Badge>
                <Badge
                  variant={
                    empresa.status_contato === 'ativo'
                      ? 'success'
                      : empresa.status_contato === 'perdido'
                      ? 'danger'
                      : 'secondary'
                  }
                >
                  {empresa.status_contato === 'ativo'
                    ? 'Ativo'
                    : empresa.status_contato === 'inativo'
                    ? 'Inativo'
                    : 'Perdido'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              icon={<Edit className="w-5 h-5" />}
              onClick={() => navigate(`/empresas/${empresa.id}/editar`)}
            >
              Editar
            </Button>
            <Button variant="danger" icon={<Trash2 className="w-5 h-5" />} onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dados Principais */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Dados Principais
          </h2>

          <dl className="space-y-4">
            <InfoItem
              label={empresa.tipo_pessoa === 'PJ' || empresa.tipo_pessoa === 'J' ? 'CNPJ' : 'CPF'}
              value={formatCPFCNPJ(empresa.cnpj_cpf || empresa.cpf || empresa.cnpj)}
            />
            <InfoItem label="Inscrição Estadual" value={empresa.inscricao_estadual} />
            <InfoItem label="Inscrição Municipal" value={empresa.inscricao_municipal} />
            <InfoItem label="Cadastrado em" value={formatDate(empresa.created_at)} />
            <InfoItem label="Última atualização" value={formatDate(empresa.updated_at)} />
          </dl>
        </div>

        {/* Endereço */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço</h2>

          <dl className="space-y-4">
            <InfoItem label="CEP" value={empresa.cep} />
            <InfoItem
              label="Endereço"
              value={`${empresa.logradouro}, ${empresa.numero}`}
            />
            <InfoItem label="Complemento" value={empresa.complemento} />
            <InfoItem label="Bairro" value={empresa.bairro} />
            <InfoItem label="Cidade/UF" value={`${empresa.cidade} - ${empresa.estado}`} />
          </dl>
        </div>

        {/* Contato */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contato</h2>

          <dl className="space-y-4">
            <InfoItem label="Telefone" value={formatPhone(empresa.telefone)} />
            <InfoItem label="Celular" value={empresa.celular && formatPhone(empresa.celular)} />
            <InfoItem
              label="WhatsApp"
              value={empresa.whatsapp && formatPhone(empresa.whatsapp)}
            />
            <InfoItem label="Email" value={empresa.email} />
          </dl>
        </div>
      </div>

      {/* Observações */}
      {empresa.observacoes && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Observações
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {empresa.observacoes}
          </p>
        </div>
      )}

      {/* Tabs futuras */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600">
            Equipamentos
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Ordens de Serviço
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Histórico
          </button>
        </div>

        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p>Essas funcionalidades serão implementadas nas próximas fases</p>
        </div>
      </div>
    </div>
  );
};

export default EmpresaDetails;
