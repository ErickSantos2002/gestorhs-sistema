import api from './api';
import { RelatorioVencimentos } from '@/types';

export const relatorioService = {
  async getVencimentos(params?: {
    empresa_id?: number;
    dias_antecedencia?: number;
  }): Promise<RelatorioVencimentos[]> {
    const response = await api.get('/relatorios/vencimentos', { params });
    return response.data.data;
  },

  async downloadVencimentos(params?: {
    empresa_id?: number;
    dias_antecedencia?: number;
    formato?: 'pdf' | 'excel';
  }): Promise<Blob> {
    const response = await api.get('/relatorios/vencimentos/download', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadCertificado(osId: number): Promise<Blob> {
    const response = await api.get(`/relatorios/certificado/${osId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadOS(osId: number): Promise<Blob> {
    const response = await api.get(`/relatorios/ordem-servico/${osId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async getFaturamento(params: {
    data_inicio: string;
    data_fim: string;
    formato?: 'pdf' | 'excel';
  }): Promise<Blob> {
    const response = await api.get('/relatorios/faturamento', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
