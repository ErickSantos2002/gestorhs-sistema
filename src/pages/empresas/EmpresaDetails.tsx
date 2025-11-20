import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { empresaService, equipamentoEmpresaService, equipamentoService } from '@/services';
import { Empresa, EquipamentoEmpresa, Equipamento } from '@/types';
import { Button, Spinner, Badge, Modal, Select, Input } from '@/components/common';
import { ArrowLeft, Edit, Trash2, Building2, Plus, Package } from 'lucide-react';
import { formatCPFCNPJ, formatPhone, formatDate } from '@/utils';
import toast from 'react-hot-toast';

const EmpresaDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'equipamentos' | 'ordens' | 'historico'>('equipamentos');

  // Estados para equipamentos
  const [equipamentosEmpresa, setEquipamentosEmpresa] = useState<EquipamentoEmpresa[]>([]);
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState<Equipamento[]>([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(false);
  const [showModalEquipamento, setShowModalEquipamento] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<number | ''>('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [numeroPatrimonio, setNumeroPatrimonio] = useState('');

  useEffect(() => {
    loadEmpresa();
    loadEquipamentosDisponiveis();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'equipamentos' && empresa) {
      loadEquipamentosEmpresa();
    }
  }, [activeTab, empresa]);

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

  const loadEquipamentosEmpresa = async () => {
    if (!empresa) return;

    try {
      setLoadingEquipamentos(true);
      const data = await equipamentoEmpresaService.getByEmpresa(empresa.id);
      setEquipamentosEmpresa(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      toast.error('Erro ao carregar equipamentos');
    } finally {
      setLoadingEquipamentos(false);
    }
  };

  const loadEquipamentosDisponiveis = async () => {
    try {
      const response = await equipamentoService.list({ size: 100, ativo: 'S' });
      setEquipamentosDisponiveis(response.items || []);
    } catch (error) {
      console.error('Erro ao carregar equipamentos disponíveis:', error);
    }
  };

  const handleAdicionarEquipamento = async () => {
    if (!empresa || !equipamentoSelecionado) return;

    try {
      await equipamentoEmpresaService.create({
        empresa_id: empresa.id,
        equipamento_id: equipamentoSelecionado,
        numero_serie: numeroSerie || undefined,
        numero_patrimonio: numeroPatrimonio || undefined,
      });

      toast.success('Equipamento vinculado com sucesso!');
      setShowModalEquipamento(false);
      setEquipamentoSelecionado('');
      setNumeroSerie('');
      setNumeroPatrimonio('');
      loadEquipamentosEmpresa();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao vincular equipamento');
    }
  };

  const handleRemoverEquipamento = async (equipamentoEmpresaId: number) => {
    if (!confirm('Deseja realmente desvincular este equipamento?')) return;

    try {
      await equipamentoEmpresaService.delete(equipamentoEmpresaId);
      toast.success('Equipamento desvinculado com sucesso!');
      loadEquipamentosEmpresa();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao desvincular equipamento');
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
            <InfoItem
              label="Cadastrado em"
              value={empresa.data_criacao ? formatDate(empresa.data_criacao) : undefined}
            />
            <InfoItem
              label="Última atualização"
              value={empresa.data_atualizacao ? formatDate(empresa.data_atualizacao) : undefined}
            />
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

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('equipamentos')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'equipamentos'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Equipamentos
          </button>
          <button
            onClick={() => setActiveTab('ordens')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'ordens'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Ordens de Serviço
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'historico'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Histórico
          </button>
        </div>

        {/* Conteúdo da aba Equipamentos */}
        {activeTab === 'equipamentos' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Equipamentos Vinculados
              </h3>
              <Button
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setShowModalEquipamento(true)}
                size="sm"
              >
                Adicionar Equipamento
              </Button>
            </div>

            {loadingEquipamentos ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : equipamentosEmpresa.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum equipamento vinculado</p>
                <p className="text-sm mt-1">Clique em "Adicionar Equipamento" para começar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipamentosEmpresa.map((eq) => (
                  <div
                    key={eq.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {eq.equipamento?.descricao || `Equipamento ID: ${eq.equipamento_id}`}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoverEquipamento(eq.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    {eq.numero_serie && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Série: {eq.numero_serie}
                      </p>
                    )}
                    {eq.numero_patrimonio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Patrimônio: {eq.numero_patrimonio}
                      </p>
                    )}
                    <div className="mt-2">
                      <Badge variant={eq.ativo === 'S' ? 'success' : 'secondary'}>
                        {eq.ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Outras abas */}
        {activeTab === 'ordens' && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>Ordens de Serviço serão listadas aqui</p>
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>Histórico será exibido aqui</p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Equipamento */}
      <Modal
        isOpen={showModalEquipamento}
        onClose={() => {
          setShowModalEquipamento(false);
          setEquipamentoSelecionado('');
          setNumeroSerie('');
          setNumeroPatrimonio('');
        }}
        title="Adicionar Equipamento"
      >
        <div className="space-y-4">
          <Select
            label="Equipamento"
            required
            value={equipamentoSelecionado}
            onChange={(e) => setEquipamentoSelecionado(Number(e.target.value) || '')}
            options={[
              { value: '', label: 'Selecione um equipamento' },
              ...equipamentosDisponiveis.map((eq) => ({
                value: eq.id,
                label: `${eq.codigo} - ${eq.descricao}`,
              })),
            ]}
          />

          <Input
            label="Número de Série"
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value)}
            placeholder="Opcional"
          />

          <Input
            label="Número de Patrimônio"
            value={numeroPatrimonio}
            onChange={(e) => setNumeroPatrimonio(e.target.value)}
            placeholder="Opcional"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModalEquipamento(false);
                setEquipamentoSelecionado('');
                setNumeroSerie('');
                setNumeroPatrimonio('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAdicionarEquipamento}
              disabled={!equipamentoSelecionado}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmpresaDetails;
