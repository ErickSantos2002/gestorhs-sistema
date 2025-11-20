import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { equipamentoService } from '@/services';
import { Equipamento } from '@/types';
import { Button, Spinner, Badge } from '@/components/common';
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '@/utils';
import toast from 'react-hot-toast';

const EquipamentoDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipamento();
  }, [id]);

  const loadEquipamento = async () => {
    try {
      setLoading(true);
      const data = await equipamentoService.getById(Number(id));
      setEquipamento(data);
    } catch (error) {
      toast.error('Erro ao carregar equipamento');
      navigate('/equipamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!equipamento) return;

    if (!confirm(`Deseja realmente excluir o equipamento "${equipamento.descricao}"?`)) {
      return;
    }

    try {
      await equipamentoService.delete(equipamento.id);
      toast.success('Equipamento excluído com sucesso');
      navigate('/equipamentos');
    } catch (error) {
      toast.error('Erro ao excluir equipamento');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!equipamento) return null;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Imagem */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {equipamento.imagem ? (
                <img
                  src={equipamento.imagem}
                  alt={equipamento.descricao}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-24 h-24 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {equipamento.categoria?.nome && (
                    <Badge variant="info">{equipamento.categoria.nome}</Badge>
                  )}
                  <Badge variant={equipamento.ativo === 'S' ? 'success' : 'secondary'}>
                    {equipamento.ativo === 'S' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {equipamento.descricao}
                </h1>

                <p className="text-gray-600 dark:text-gray-400">
                  {equipamento.marca?.nome || `Marca ID: ${equipamento.marca_id}`}
                  {equipamento.modelo && ` - ${equipamento.modelo}`}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  icon={<Edit className="w-5 h-5" />}
                  onClick={() => navigate(`/equipamentos/${equipamento.id}/editar`)}
                >
                  Editar
                </Button>
                <Button variant="danger" icon={<Trash2 className="w-5 h-5" />} onClick={handleDelete}>
                  Excluir
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Código</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {equipamento.codigo}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Período de Calibração</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {equipamento.periodo_calibracao_dias} dias
                </p>
              </div>

              {equipamento.preco_de && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preço De</p>
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 line-through">
                    {formatCurrency(Number(equipamento.preco_de))}
                  </p>
                </div>
              )}

              {equipamento.preco_por && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preço Por</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(Number(equipamento.preco_por))}
                  </p>
                </div>
              )}

              {equipamento.custo && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Custo</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(Number(equipamento.custo))}
                  </p>
                </div>
              )}

              {equipamento.estoque_atual !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estoque Atual</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {equipamento.estoque_atual}
                  </p>
                </div>
              )}
            </div>

            {equipamento.detalhes && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Detalhes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {equipamento.detalhes}
                </p>
              </div>
            )}

            {equipamento.especificacoes_tecnicas && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Especificações Técnicas
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {equipamento.especificacoes_tecnicas}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipamentoDetails;
