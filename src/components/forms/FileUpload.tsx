import React, { useRef, useState } from 'react';
import { cn } from '@/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/common';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // em MB
  onUpload: (file: File) => Promise<void>;
  currentFile?: string;
  onRemove?: () => void;
  preview?: boolean;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  maxSize = 5,
  onUpload,
  currentFile,
  onRemove,
  preview = true,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    // Validar tamanho
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > maxSize) {
      alert(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      await onUpload(file);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {currentFile && preview ? (
        <div className="relative">
          <img
            src={currentFile}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          {onRemove && !disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={disabled || uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enviando...
              </p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Arraste e solte ou{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={disabled}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  clique para selecionar
                </button>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Máximo: {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
