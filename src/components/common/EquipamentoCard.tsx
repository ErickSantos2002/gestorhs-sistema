import React from 'react';
import { Equipamento } from '@/types';
import { Badge } from './Badge';
import { formatCurrency } from '@/utils';
import { Package, Edit, Trash2 } from 'lucide-react';

interface EquipamentoCardProps {
  equipamento: Equipamento;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EquipamentoCard: React.FC<EquipamentoCardProps> = ({
  equipamento,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
    >
      {/* Imagem */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {equipamento.imagem ? (
          <img
            src={equipamento.imagem}
            alt={equipamento.descricao}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <Package className="w-16 h-16 text-gray-400" />
        )}

        {/* Badge de status */}
        <div className="absolute top-2 right-2">
          <Badge variant={equipamento.ativo === 'S' ? 'success' : 'secondary'} size="sm">
            {equipamento.ativo === 'S' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Categoria e Código */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="info" size="sm">
            {equipamento.categoria?.nome || 'Sem categoria'}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            #{equipamento.codigo}
          </span>
        </div>

        {/* Descrição */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {equipamento.descricao}
        </h3>

        {/* Marca e Modelo */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {equipamento.marca?.nome}
          {equipamento.modelo && ` - ${equipamento.modelo}`}
        </p>

        {/* Preço e Período */}
        <div className="flex items-center justify-between mb-3">
          {equipamento.preco_venda && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Preço</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(equipamento.preco_venda)}
              </p>
            </div>
          )}

          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Calibração</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {equipamento.periodo_calibracao_dias} dias
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
