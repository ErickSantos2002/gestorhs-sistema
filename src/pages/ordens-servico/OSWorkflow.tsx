import React, { useState } from 'react';
import { Modal, Button, Select } from '@/components/common';
import { OrdemServico, FaseOS } from '@/types';
import { ordemServicoService } from '@/services';
import toast from 'react-hot-toast';

interface OSWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  os: OrdemServico;
  onSuccess: () => void;
}

const OSWorkflow: React.FC<OSWorkflowProps> = ({ isOpen, onClose, os, onSuccess }) => {
  const [novaFase, setNovaFase] = useState<FaseOS | ''>('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  // Definir fases válidas baseado na fase atual
  const getValidFases = (): FaseOS[] => {
    const faseTransitions: Record<FaseOS, FaseOS[]> = {
      solicitado: ['enviado', 'cancelado'],
      enviado: ['recebido', 'cancelado'],
      recebido: ['calibracao', 'cancelado'],
      calibracao: ['calibrado', 'cancelado'],
      calibrado: ['retornando', 'cancelado'],
      retornando: ['entregue', 'cancelado'],
      entregue: [],
      cancelado: [],
    };

    return faseTransitions[os.fase] || [];
  };

  const validFases = getValidFases();

  const faseLabels: Record<FaseOS, string> = {
    solicitado: 'Solicitado',
    enviado: 'Enviado ao Cliente',
    recebido: 'Recebido',
    calibracao: 'Em Calibração',
    calibrado: 'Calibrado',
    retornando: 'Retornando',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaFase) {
      toast.error('Selecione a nova fase');
      return;
    }

    if (!validFases.includes(novaFase)) {
      toast.error('Fase inválida para esta ordem');
      return;
    }

    try {
      setLoading(true);

      await ordemServicoService.mudarFase(os.id, novaFase, observacoes || undefined);

      toast.success('Fase alterada com sucesso');
      onSuccess();
      handleClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao alterar fase';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNovaFase('');
    setObservacoes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Mudar Fase da OS" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            OS #{os.chave_acesso} - Fase atual: <strong>{faseLabels[os.fase]}</strong>
          </p>
        </div>

        <Select
          label="Nova Fase"
          required
          value={novaFase}
          onChange={(e) => setNovaFase(e.target.value as FaseOS)}
          options={[
            { value: '', label: 'Selecione a nova fase' },
            ...validFases.map((fase) => ({
              value: fase,
              label: faseLabels[fase],
            })),
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observações (opcional)
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Adicione observações sobre esta mudança de fase..."
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OSWorkflow;
