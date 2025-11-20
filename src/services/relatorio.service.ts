import api from './api';
import {
  RelatorioVencimentos,
  RelatorioCalibracoesData,
  RelatorioEquipamentosData,
  RelatorioFinanceiroData,
} from '@/types';

export const relatorioService = {
  // Relatório de Vencimentos
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

  // Relatório de Calibrações
  async getCalibracao(params: {
    data_inicio: string;
    data_fim: string;
    empresa_id?: number;
    equipamento_id?: number;
    situacao?: string;
  }): Promise<RelatorioCalibracoesData> {
    const response = await api.get('/relatorios/calibracoes', { params });
    return response.data.data;
  },

  async downloadCalibracao(params: {
    data_inicio: string;
    data_fim: string;
    empresa_id?: number;
    equipamento_id?: number;
    situacao?: string;
    formato: 'pdf' | 'excel';
  }): Promise<Blob> {
    const response = await api.get('/relatorios/calibracoes/download', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Relatório de Equipamentos
  async getEquipamentos(params?: {
    categoria_id?: number;
    marca_id?: number;
    status?: string;
  }): Promise<RelatorioEquipamentosData> {
    const response = await api.get('/relatorios/equipamentos', { params });
    return response.data.data;
  },

  async downloadEquipamentos(params: {
    categoria_id?: number;
    marca_id?: number;
    status?: string;
    formato: 'pdf' | 'excel';
  }): Promise<Blob> {
    const response = await api.get('/relatorios/equipamentos/download', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Relatório Financeiro
  async getFinanceiro(params: {
    data_inicio: string;
    data_fim: string;
    agrupar_por?: 'mes' | 'cliente' | 'equipamento';
  }): Promise<RelatorioFinanceiroData> {
    const response = await api.get('/relatorios/financeiro', { params });
    return response.data.data;
  },

  async downloadFinanceiro(params: {
    data_inicio: string;
    data_fim: string;
    agrupar_por?: 'mes' | 'cliente' | 'equipamento';
    formato: 'pdf' | 'excel';
  }): Promise<Blob> {
    const response = await api.get('/relatorios/financeiro/download', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Downloads individuais
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
};
