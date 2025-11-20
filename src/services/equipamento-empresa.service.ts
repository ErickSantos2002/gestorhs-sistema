import api from './api';
import { EquipamentoEmpresa, EquipamentoEmpresaFormData, PaginatedResponse } from '@/types';

interface ListEquipamentosEmpresaParams {
  page?: number;
  size?: number;
  empresa_id?: number;
  equipamento_id?: number;
  numero_serie?: string;
  ativo?: string;
}

export const equipamentoEmpresaService = {
  async list(params?: ListEquipamentosEmpresaParams): Promise<PaginatedResponse<EquipamentoEmpresa>> {
    const response = await api.get('/equipamentos-empresa', { params });
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

  async getById(id: number): Promise<EquipamentoEmpresa> {
    const response = await api.get(`/equipamentos-empresa/${id}`);
    return response.data.data || response.data;
  },

  async getByEmpresa(empresaId: number): Promise<EquipamentoEmpresa[]> {
    const response = await api.get(`/equipamentos-empresa`, {
      params: { empresa_id: empresaId, size: 100 }
    });
    const data = response.data.data || response.data;

    // Se vier com paginação, extrair apenas items
    if (data.items) {
      return data.items;
    }

    return data;
  },

  async create(data: EquipamentoEmpresaFormData): Promise<EquipamentoEmpresa> {
    const response = await api.post('/equipamentos-empresa', data);
    return response.data.data || response.data;
  },

  async update(id: number, data: Partial<EquipamentoEmpresaFormData>): Promise<EquipamentoEmpresa> {
    const response = await api.put(`/equipamentos-empresa/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipamentos-empresa/${id}`);
  },
};
