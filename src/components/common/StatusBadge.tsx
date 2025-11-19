import React from 'react';
import { Badge } from './Badge';
import { FaseOS, SituacaoOS } from '@/types';

interface StatusBadgeProps {
  fase?: FaseOS;
  situacao?: SituacaoOS;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ fase, situacao }) => {
  if (fase) {
    const faseConfig: Record<FaseOS, { label: string; variant: any }> = {
      solicitado: { label: 'Solicitado', variant: 'info' },
      enviado: { label: 'Enviado', variant: 'warning' },
      recebido: { label: 'Recebido', variant: 'success' },
      calibracao: { label: 'Em Calibração', variant: 'info' },
      calibrado: { label: 'Calibrado', variant: 'success' },
      retornando: { label: 'Retornando', variant: 'warning' },
      entregue: { label: 'Entregue', variant: 'success' },
      cancelado: { label: 'Cancelado', variant: 'danger' },
    };

    const config = faseConfig[fase];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  if (situacao) {
    const situacaoConfig: Record<SituacaoOS, { label: string; variant: any }> = {
      aberta: { label: 'Aberta', variant: 'info' },
      andamento: { label: 'Em Andamento', variant: 'warning' },
      concluida: { label: 'Concluída', variant: 'success' },
      cancelada: { label: 'Cancelada', variant: 'danger' },
    };

    const config = situacaoConfig[situacao];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  return null;
};
