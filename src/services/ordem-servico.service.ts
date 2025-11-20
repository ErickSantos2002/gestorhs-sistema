import api from './api';
import { OrdemServico, OrdemServicoFormData, FinalizarOSData, PaginatedResponse, FaseOS, SituacaoOS } from '@/types';

interface ListOSParams {
  page?: number;
  size?: number;
  empresa_id?: number;
  chave_acesso?: string;
  fase?: FaseOS;
  situacao?: SituacaoOS;
  data_inicio?: string;
  data_fim?: string;
}

export const ordemServicoService = {
  async list(params?: ListOSParams): Promise<PaginatedResponse<OrdemServico>> {
    const response = await api.get('/ordens-servico', { params });
    const data = response.data.data || response.data;

    // Mapear estrutura do backend para o formato esperado pelo frontend
    if (data.pagination) {
      return {
        items: data.items,
        total: data.pagination.total,
        page: data.pagination.page,
        size: data.pagination.size,
        pages: data.pagination.pages,
      };
    }

    return data;
  },

  async getById(id: number): Promise<OrdemServico> {
    const response = await api.get(`/ordens-servico/${id}`);
    return response.data.data || response.data;
  },

  async getByChaveAcesso(chaveAcesso: string): Promise<OrdemServico> {
    const response = await api.get(`/ordens-servico/chave/${chaveAcesso}`);
    return response.data.data || response.data;
  },

  async create(data: OrdemServicoFormData): Promise<OrdemServico> {
    const response = await api.post('/ordens-servico', data);
    return response.data.data || response.data;
  },

  async update(id: number, data: Partial<OrdemServicoFormData>): Promise<OrdemServico> {
    const response = await api.put(`/ordens-servico/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/ordens-servico/${id}`);
  },

  async mudarFase(id: number, fase: FaseOS, observacoes?: string): Promise<OrdemServico> {
    const response = await api.post(`/ordens-servico/${id}/fase`, {
      fase,
      observacoes,
    });
    return response.data.data || response.data;
  },

  async finalizar(id: number, data: FinalizarOSData): Promise<OrdemServico> {
    const response = await api.post(`/ordens-servico/${id}/finalizar`, data);
    return response.data.data || response.data;
  },

  async uploadCertificado(id: number, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/ordens-servico/${id}/certificado`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  async getTimeline(id: number): Promise<any[]> {
    const response = await api.get(`/ordens-servico/${id}/timeline`);
    const data = response.data.data || response.data;

    // Se vier com paginação, extrair apenas items
    if (data.items) {
      return data.items;
    }

    return data;
  },

  async getByEmpresa(empresaId: number): Promise<OrdemServico[]> {
    const response = await api.get(`/empresas/${empresaId}/ordens-servico`);
    const data = response.data.data || response.data;

    // Se vier com paginação, extrair apenas items
    if (data.items) {
      return data.items;
    }

    return data;
  },

  async cancelar(id: number): Promise<OrdemServico> {
    const response = await api.post(`/ordens-servico/${id}/cancelar`);
    return response.data.data || response.data;
  },
};
