import api from './api';
import { DashboardMetrics, PaginatedResponse, OrdemServico } from '@/types';

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/dashboard/principal');
    return response.data.data;
  },

  async getAndamento(params?: { page?: number; size?: number }): Promise<PaginatedResponse<OrdemServico>> {
    const response = await api.get('/dashboard/andamento', { params });
    return response.data.data;
  },

  async getClientesAtrasados() {
    const response = await api.get('/dashboard/atrasados');
    return response.data.data;
  },

  async getCalibracoesAtrasadas() {
    const response = await api.get('/dashboard/calibracoes-atrasadas');
    return response.data.data;
  },

  async getCalibracoesProximas() {
    const response = await api.get('/dashboard/calibracoes-proximas');
    return response.data.data;
  },

  async getFinalizadas() {
    const response = await api.get('/dashboard/finalizadas');
    return response.data.data;
  },

  async getNaoFazer() {
    const response = await api.get('/dashboard/nao-fazer');
    return response.data.data;
  },

  async getClientesPerdidos() {
    const response = await api.get('/dashboard/perdidos');
    return response.data.data;
  },
};
