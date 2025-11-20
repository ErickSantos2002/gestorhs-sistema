import api from './api';
import { Marca } from '@/types';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface MarcaFormData {
  nome: string;
  descricao?: string;
  ativo?: string;
}

export const marcaService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    search?: string;
    ativo?: string;
  }): Promise<PaginatedResponse<Marca>> {
    // Filtrar parâmetros vazios/undefined
    const cleanParams: Record<string, any> = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.size) cleanParams.size = params.size;
    if (params?.search) cleanParams.search = params.search;
    if (params?.ativo) cleanParams.ativo = params.ativo;

    const response = await api.get('/equipamentos/marcas', { params: cleanParams });
    return response.data.data || response.data;
  },

  async getById(id: number): Promise<Marca> {
    const response = await api.get(`/equipamentos/marcas/${id}`);
    return response.data.data || response.data;
  },

  async create(data: MarcaFormData): Promise<Marca> {
    const response = await api.post('/equipamentos/marcas', data);
    return response.data.data || response.data;
  },

  async update(id: number, data: Partial<MarcaFormData>): Promise<Marca> {
    const response = await api.put(`/equipamentos/marcas/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipamentos/marcas/${id}`);
  },

  async toggleStatus(id: number): Promise<Marca> {
    const response = await api.patch(`/equipamentos/marcas/${id}/toggle-status`);
    return response.data.data || response.data;
  },
};
