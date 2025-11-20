import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '@/components/common';
import { OrdemServico } from '@/types';
import { ordemServicoService, uploadService } from '@/services';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface OSFinalizarProps {
  isOpen: boolean;
  onClose: () => void;
  os: OrdemServico;
  onSuccess: () => void;
}

const OSFinalizar: React.FC<OSFinalizarProps> = ({ isOpen, onClose, os, onSuccess }) => {
  const [dataFim, setDataFim] = useState('');
  const [numeroCertificado, setNumeroCertificado] = useState('');
  const [teste1, setTeste1] = useState<number | ''>('');
  const [teste2, setTeste2] = useState<number | ''>('');
  const [teste3, setTeste3] = useState<number | ''>('');
  const [media, setMedia] = useState<number | ''>('');
  const [situacaoAprovacao, setSituacaoAprovacao] = useState<'aprovado' | 'reprovado' | ''>('');
  const [certificadoFile, setCertificadoFile] = useState<File | null>(null);
  const [certificadoUrl, setCertificadoUrl] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-calcular média quando os testes mudarem
  useEffect(() => {
    if (teste1 !== '' && teste2 !== '' && teste3 !== '') {
      const calculatedMedia = (Number(teste1) + Number(teste2) + Number(teste3)) / 3;
      setMedia(Number(calculatedMedia.toFixed(2)));
    }
  }, [teste1, teste2, teste3]);

  // Definir data de hoje como padrão
  useEffect(() => {
    if (isOpen && !dataFim) {
      const today = new Date().toISOString().split('T')[0];
      setDataFim(today);
    }
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    try {
      setUploadingFile(true);
      const url = await uploadService.uploadCertificado(file);
      setCertificadoUrl(url);
      setCertificadoFile(file);
      toast.success('Certificado carregado com sucesso');
    } catch (error) {
      toast.error('Erro ao carregar certificado');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setCertificadoFile(null);
    setCertificadoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numeroCertificado) {
      toast.error('Informe o número do certificado');
      return;
    }

    if (!dataFim) {
      toast.error('Informe a data de fim da calibração');
      return;
    }

    if (!situacaoAprovacao) {
      toast.error('Informe a situação de aprovação');
      return;
    }

    try {
      setLoading(true);

      await ordemServicoService.finalizar(os.id, {
        data_fim_calibracao: dataFim,
        numero_certificado: numeroCertificado,
        teste_1: teste1 || undefined,
        teste_2: teste2 || undefined,
        teste_3: teste3 || undefined,
        media: media || undefined,
        situacao_aprovacao: situacaoAprovacao,
        certificado: certificadoUrl || undefined,
      });

      toast.success('Calibração finalizada com sucesso');
      onSuccess();
      handleClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao finalizar calibração';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDataFim('');
    setNumeroCertificado('');
    setTeste1('');
    setTeste2('');
    setTeste3('');
    setMedia('');
    setSituacaoAprovacao('');
    setCertificadoFile(null);
    setCertificadoUrl(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Finalizar Calibração" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            OS #{os.chave_acesso}
            {os.equipamento_empresa?.equipamento?.descricao &&
              ` - ${os.equipamento_empresa.equipamento.descricao}`
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data Fim Calibração"
            type="date"
            required
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />

          <Input
            label="Número do Certificado"
            required
            value={numeroCertificado}
            onChange={(e) => setNumeroCertificado(e.target.value)}
            placeholder="CERT-2024-001"
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Testes de Calibração
          </h3>

          <div className="grid grid-cols-4 gap-4">
            <Input
              label="Teste 1"
              type="number"
              step="0.01"
              value={teste1}
              onChange={(e) => setTeste1(Number(e.target.value))}
              placeholder="0.00"
            />

            <Input
              label="Teste 2"
              type="number"
              step="0.01"
              value={teste2}
              onChange={(e) => setTeste2(Number(e.target.value))}
              placeholder="0.00"
            />

            <Input
              label="Teste 3"
              type="number"
              step="0.01"
              value={teste3}
              onChange={(e) => setTeste3(Number(e.target.value))}
              placeholder="0.00"
            />

            <Input
              label="Média"
              type="number"
              step="0.01"
              value={media}
              onChange={(e) => setMedia(Number(e.target.value))}
              placeholder="0.00"
              disabled={teste1 !== '' && teste2 !== '' && teste3 !== ''}
              helperText={
                teste1 !== '' && teste2 !== '' && teste3 !== '' ? 'Calculado automaticamente' : ''
              }
            />
          </div>
        </div>

        <Select
          label="Situação de Aprovação"
          required
          value={situacaoAprovacao}
          onChange={(e) => setSituacaoAprovacao(e.target.value as 'aprovado' | 'reprovado')}
          options={[
            { value: '', label: 'Selecione a situação' },
            { value: 'aprovado', label: 'Aprovado' },
            { value: 'reprovado', label: 'Reprovado' },
          ]}
        />

        {/* Upload de Certificado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certificado PDF (opcional)
          </label>

          {!certificadoFile ? (
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={uploadingFile}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {uploadingFile ? 'Carregando...' : 'Clique ou arraste o arquivo PDF aqui'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Máximo 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <FileText className="w-8 h-8 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {certificadoFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(certificadoFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading || uploadingFile}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={uploadingFile}>
            Finalizar Calibração
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OSFinalizar;
