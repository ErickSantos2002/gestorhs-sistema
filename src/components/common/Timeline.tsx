import React from 'react';
import { cn } from '@/utils';
import { formatDateTime } from '@/utils';
import { FaseOS } from '@/types';
import { Check, Clock, XCircle } from 'lucide-react';

interface TimelineItem {
  fase: FaseOS;
  data?: string;
  ativo: boolean;
  concluido: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
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

  const faseColors: Record<FaseOS, string> = {
    solicitado: 'bg-blue-500',
    enviado: 'bg-yellow-500',
    recebido: 'bg-green-500',
    calibracao: 'bg-blue-600',
    calibrado: 'bg-purple-500',
    retornando: 'bg-orange-500',
    entregue: 'bg-green-600',
    cancelado: 'bg-red-500',
  };

  return (
    <div className="relative">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCanceled = item.fase === 'cancelado';

        return (
          <div key={item.fase} className="relative pb-8">
            {!isLast && (
              <div
                className={cn(
                  'absolute left-4 top-8 w-0.5 h-full',
                  item.concluido ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                )}
              />
            )}

            <div className="flex items-start gap-4">
              {/* Ícone */}
              <div
                className={cn(
                  'relative z-10 flex items-center justify-center w-8 h-8 rounded-full',
                  item.concluido
                    ? isCanceled
                      ? 'bg-red-500'
                      : 'bg-green-500'
                    : item.ativo
                    ? faseColors[item.fase]
                    : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                {item.concluido ? (
                  isCanceled ? (
                    <XCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Check className="w-5 h-5 text-white" />
                  )
                ) : item.ativo ? (
                  <Clock className="w-5 h-5 text-white animate-pulse" />
                ) : (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pt-0.5">
                <h3
                  className={cn(
                    'text-sm font-semibold',
                    item.concluido || item.ativo
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {faseLabels[item.fase]}
                </h3>

                {item.data && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDateTime(item.data)}
                  </p>
                )}

                {item.ativo && !item.concluido && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Fase Atual
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
