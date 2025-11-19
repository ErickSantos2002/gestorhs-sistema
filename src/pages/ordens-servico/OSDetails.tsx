import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ordemServicoService } from '@/services';
import { OrdemServico, FaseOS } from '@/types';
import { Button, Spinner, StatusBadge, Timeline } from '@/components/common';
import { ArrowLeft, Edit, FileText, XCircle, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/utils';
import toast from 'react-hot-toast';
import OSWorkflow from './OSWorkflow';
import OSFinalizar from './OSFinalizar';

const OSDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [os, setOS] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [finalizarModalOpen, setFinalizarModalOpen] = useState(false);

  useEffect(() => {
    loadOS();
  }, [id]);

  const loadOS = async () => {
    try {
      setLoading(true);
      const data = await ordemServicoService.getById(Number(id));
      setOS(data);
    } catch (error) {
      toast.error('Erro ao carregar ordem de serviço');
      navigate('/ordens');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (!os) return;

    if (!confirm('Deseja realmente cancelar esta ordem de serviço?')) {
      return;
    }

    try {
      await ordemServicoService.cancelar(os.id);
      toast.success('Ordem de serviço cancelada com sucesso');
      loadOS();
    } catch (error) {
      toast.error('Erro ao cancelar ordem de serviço');
    }
  };

  const canChangePhase = os && os.situacao !== 'concluida' && os.situacao !== 'cancelada';
  const canFinalize = os && os.fase === 'calibrado' && os.situacao !== 'concluida';
  const canCancel = os && os.situacao !== 'concluida' && os.situacao !== 'cancelada';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!os) return null;

  // Preparar timeline items
  const allFases: FaseOS[] = [
    'solicitado',
    'enviado',
    'recebido',
    'calibracao',
    'calibrado',
    'retornando',
    'entregue',
  ];

  // Se foi cancelado, adiciona a fase de cancelado
  if (os.fase === 'cancelado') {
    allFases.push('cancelado');
  }

  const faseOrder: Record<FaseOS, number> = {
    solicitado: 0,
    enviado: 1,
    recebido: 2,
    calibracao: 3,
    calibrado: 4,
    retornando: 5,
    entregue: 6,
    cancelado: 7,
  };

  const timelineItems = allFases.map((fase) => {
    const currentFaseOrder = faseOrder[os.fase];
    const itemFaseOrder = faseOrder[fase];

    // Determinar se a fase está concluída
    let concluido = false;
    if (os.fase === 'cancelado') {
      concluido = fase === 'cancelado';
    } else {
      concluido = itemFaseOrder < currentFaseOrder;
    }

    // Determinar se é a fase ativa
    const ativo = fase === os.fase;

    // Determinar a data correspondente
    let data: string | undefined;
    switch (fase) {
      case 'solicitado':
        data = os.data_solicitacao;
        break;
      case 'enviado':
        data = os.data_envio;
        break;
      case 'recebido':
        data = os.data_recebimento;
        break;
      case 'calibracao':
        data = os.data_inicio_calibracao;
        break;
      case 'calibrado':
        data = os.data_fim_calibracao;
        break;
      case 'retornando':
        data = os.data_retorno;
        break;
      case 'entregue':
        data = os.data_entrega;
        break;
      case 'cancelado':
        data = os.updated_at;
        break;
    }

    return {
      fase,
      data,
      ativo,
      concluido,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      <Button
        variant="ghost"
        icon={<ArrowLeft className="w-5 h-5" />}
        onClick={() => navigate('/ordens')}
        className="mb-4"
      >
        Voltar
      </Button>

      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              OS #{os.chave_acesso}
            </h1>
            <div className="flex gap-2">
              <StatusBadge fase={os.fase} />
              <StatusBadge situacao={os.situacao} />
            </div>
          </div>

          <div className="flex gap-2">
            {canChangePhase && (
              <Button
                icon={<Edit className="w-5 h-5" />}
                onClick={() => setWorkflowModalOpen(true)}
              >
                Mudar Fase
              </Button>
            )}

            {canFinalize && (
              <Button
                variant="success"
                icon={<CheckCircle className="w-5 h-5" />}
                onClick={() => setFinalizarModalOpen(true)}
              >
                Finalizar
              </Button>
            )}

            {os.certificado && (
              <Button
                variant="secondary"
                icon={<FileText className="w-5 h-5" />}
                onClick={() => window.open(os.certificado, '_blank')}
              >
                Ver Certificado
              </Button>
            )}

            {canCancel && (
              <Button variant="danger" icon={<XCircle className="w-5 h-5" />} onClick={handleCancelar}>
                Cancelar OS
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações da OS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cliente e Equipamento */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informações Gerais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cliente</p>
                <button
                  onClick={() => navigate(`/empresas/${os.empresa.id}`)}
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline text-left"
                >
                  {os.empresa.razao_social}
                </button>
                {os.empresa.nome_fantasia && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {os.empresa.nome_fantasia}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Equipamento</p>
                <button
                  onClick={() => navigate(`/equipamentos/${os.equipamento_empresa.equipamento?.id}`)}
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline text-left"
                >
                  {os.equipamento_empresa.equipamento?.descricao}
                </button>
                {os.equipamento_empresa.numero_serie && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    NS: {os.equipamento_empresa.numero_serie}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Datas</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Solicitação</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(os.data_solicitacao)}
                </p>
              </div>

              {os.data_envio && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Envio</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(os.data_envio)}
                  </p>
                </div>
              )}

              {os.data_recebimento && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recebimento</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(os.data_recebimento)}
                  </p>
                </div>
              )}

              {os.data_inicio_calibracao && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Início Calibração</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(os.data_inicio_calibracao)}
                  </p>
                </div>
              )}

              {os.data_fim_calibracao && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fim Calibração</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(os.data_fim_calibracao)}
                  </p>
                </div>
              )}

              {os.data_retorno && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Retorno</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(os.data_retorno)}
                  </p>
                </div>
              )}

              {os.data_entrega && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Entrega</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(os.data_entrega)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dados de Calibração */}
          {os.numero_certificado && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Dados de Calibração
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Certificado</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {os.numero_certificado}
                  </p>
                </div>

                {os.teste_1 !== null && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teste 1</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {os.teste_1.toFixed(2)}
                    </p>
                  </div>
                )}

                {os.teste_2 !== null && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teste 2</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {os.teste_2.toFixed(2)}
                    </p>
                  </div>
                )}

                {os.teste_3 !== null && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teste 3</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {os.teste_3.toFixed(2)}
                    </p>
                  </div>
                )}

                {os.media !== null && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Média</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {os.media.toFixed(2)}
                    </p>
                  </div>
                )}

                {os.situacao_aprovacao && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Situação</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {os.situacao_aprovacao === 'aprovado' ? 'Aprovado' : 'Reprovado'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Valor e Observações */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informações Adicionais
            </h2>

            {os.valor && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Valor</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(os.valor)}
                </p>
              </div>
            )}

            {os.observacoes && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Observações</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {os.observacoes}
                </p>
              </div>
            )}

            {!os.valor && !os.observacoes && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Nenhuma informação adicional
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Linha do Tempo
            </h2>
            <Timeline items={timelineItems} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {os && (
        <>
          <OSWorkflow
            isOpen={workflowModalOpen}
            onClose={() => setWorkflowModalOpen(false)}
            os={os}
            onSuccess={loadOS}
          />

          <OSFinalizar
            isOpen={finalizarModalOpen}
            onClose={() => setFinalizarModalOpen(false)}
            os={os}
            onSuccess={loadOS}
          />
        </>
      )}
    </div>
  );
};

export default OSDetails;
