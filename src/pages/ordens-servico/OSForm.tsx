import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordemServicoService, empresaService, equipamentoEmpresaService } from '@/services';
import { Empresa, EquipamentoEmpresa } from '@/types';
import { Button, Input, Select, Spinner } from '@/components/common';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

const OSForm: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Empresa
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState<number | ''>('');
  const [searchEmpresa, setSearchEmpresa] = useState('');

  // Step 2: Equipamento
  const [equipamentos, setEquipamentos] = useState<EquipamentoEmpresa[]>([]);
  const [equipamentoEmpresaId, setEquipamentoEmpresaId] = useState<number | ''>('');

  // Step 3: Dados da OS
  const [observacoes, setObservacoes] = useState('');
  const [valor, setValor] = useState<number | ''>('');

  // Carregar empresas
  useEffect(() => {
    loadEmpresas();
  }, [searchEmpresa]);

  // Carregar equipamentos quando empresa for selecionada
  useEffect(() => {
    if (empresaId) {
      loadEquipamentos();
    }
  }, [empresaId]);

  const loadEmpresas = async () => {
    try {
      const response = await empresaService.list({
        page: 1,
        size: 100,
        razao_social: searchEmpresa || undefined,
      });
      setEmpresas(response.items);
    } catch (error) {
      toast.error('Erro ao carregar empresas');
    }
  };

  const loadEquipamentos = async () => {
    try {
      const data = await equipamentoEmpresaService.getByEmpresa(Number(empresaId));
      setEquipamentos(data);
    } catch (error) {
      toast.error('Erro ao carregar equipamentos');
    }
  };

  const handleNext = () => {
    if (step === 1 && !empresaId) {
      toast.error('Selecione uma empresa');
      return;
    }

    if (step === 2 && !equipamentoEmpresaId) {
      toast.error('Selecione um equipamento');
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!empresaId || !equipamentoEmpresaId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);

      const data = {
        empresa_id: Number(empresaId),
        equipamento_empresa_id: Number(equipamentoEmpresaId),
        observacoes: observacoes || undefined,
        valor: valor || undefined,
      };

      const os = await ordemServicoService.create(data);
      toast.success('Ordem de serviço criada com sucesso');
      navigate(`/ordens/${os.id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar ordem de serviço';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Selecionar Empresa' },
    { number: 2, title: 'Selecionar Equipamento' },
    { number: 3, title: 'Dados da OS' },
  ];

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

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Nova Ordem de Serviço
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Siga os passos para criar uma nova ordem
      </p>

      {/* Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors',
                    step > s.number
                      ? 'bg-green-500 text-white'
                      : step === s.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  )}
                >
                  {step > s.number ? <Check className="w-6 h-6" /> : s.number}
                </div>
                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                  {s.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-24 transition-colors',
                    step > s.number
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl mx-auto">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Selecione o Cliente
            </h2>

            <Input
              label="Buscar empresa"
              placeholder="Digite para buscar..."
              value={searchEmpresa}
              onChange={(e) => setSearchEmpresa(e.target.value)}
            />

            <Select
              label="Empresa"
              required
              value={empresaId}
              onChange={(e) => setEmpresaId(Number(e.target.value))}
              options={[
                { value: '', label: 'Selecione uma empresa' },
                ...empresas.map((e) => ({
                  value: e.id,
                  label: `${e.razao_social} ${e.nome_fantasia ? `(${e.nome_fantasia})` : ''}`,
                })),
              ]}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Selecione o Equipamento
            </h2>

            {equipamentos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhum equipamento vinculado a esta empresa.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/empresas/${empresaId}`)}
                  className="mt-4"
                >
                  Ir para a empresa e vincular equipamento
                </Button>
              </div>
            ) : (
              <Select
                label="Equipamento"
                required
                value={equipamentoEmpresaId}
                onChange={(e) => setEquipamentoEmpresaId(Number(e.target.value))}
                options={[
                  { value: '', label: 'Selecione um equipamento' },
                  ...equipamentos.map((eq) => ({
                    value: eq.id,
                    label: `${eq.equipamento?.descricao || ''} ${
                      eq.numero_serie ? `- NS: ${eq.numero_serie}` : ''
                    }`,
                  })),
                ]}
              />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Dados da Ordem
            </h2>

            <Input
              label="Valor (opcional)"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              placeholder="0.00"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre a ordem..."
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack}>
              Voltar
            </Button>
          )}

          {step < 3 ? (
            <Button icon={<ArrowRight className="w-5 h-5" />} onClick={handleNext}>
              Próximo
            </Button>
          ) : (
            <Button
              icon={<Save className="w-5 h-5" />}
              onClick={handleSubmit}
              loading={loading}
            >
              Criar Ordem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OSForm;
