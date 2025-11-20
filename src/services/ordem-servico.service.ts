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
    return response.data.data;
  },

  async getById(id: number): Promise<OrdemServico> {
    const response = await api.get(`/ordens-servico/${id}`);
    return response.data.data;
  },

  async getByChaveAcesso(chaveAcesso: string): Promise<OrdemServico> {
    const response = await api.get(`/ordens-servico/chave/${chaveAcesso}`);
    return response.data.data;
  },

  async create(data: OrdemServicoFormData): Promise<OrdemServico> {
    const response = await api.post('/ordens-servico', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<OrdemServicoFormData>): Promise<OrdemServico> {
    const response = await api.put(`/ordens-servico/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/ordens-servico/${id}`);
  },

  async mudarFase(id: number, fase: FaseOS, observacoes?: string): Promise<OrdemServico> {
    const response = await api.post(`/ordens-servico/${id}/fase`, {
      fase,
      observacoes,
    });
    return response.data.data;
  },

  async finalizar(id: number, data: FinalizarOSData): Promise<OrdemServico> {
    const response = await api.post(`/ordens-servico/${id}/finalizar`, data);
    return response.data.data;
  },

  async uploadCertificado(id: number, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/ordens-servico/${id}/certificado`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async getTimeline(id: number): Promise<any[]> {
    const response = await api.get(`/ordens-servico/${id}/timeline`);
    return response.data.data;
  },

  async getByEmpresa(empresaId: number): Promise<OrdemServico[]> {
    const response = await api.get(`/empresas/${empresaId}/ordens-servico`);
    return response.data.data;
  },
};
