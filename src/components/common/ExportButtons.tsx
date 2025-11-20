import React, { useState } from 'react';
import { Button } from './Button';
import { FileText, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportButtonsProps {
  onExportPDF: () => Promise<void>;
  onExportExcel: () => Promise<void>;
  disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportPDF,
  onExportExcel,
  disabled = false,
}) => {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const handleExportPDF = async () => {
    try {
      setLoadingPDF(true);
      await onExportPDF();
      toast.success('PDF exportado com sucesso');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao exportar PDF';
      toast.error(message);
    } finally {
      setLoadingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoadingExcel(true);
      await onExportExcel();
      toast.success('Excel exportado com sucesso');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao exportar Excel';
      toast.error(message);
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        icon={<FileText className="w-5 h-5" />}
        onClick={handleExportPDF}
        loading={loadingPDF}
        disabled={disabled || loadingExcel}
      >
        Exportar PDF
      </Button>

      <Button
        variant="success"
        icon={<FileSpreadsheet className="w-5 h-5" />}
        onClick={handleExportExcel}
        loading={loadingExcel}
        disabled={disabled || loadingPDF}
      >
        Exportar Excel
      </Button>
    </div>
  );
};

export default ExportButtons;
