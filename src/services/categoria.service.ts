import api from './api';
import { Categoria } from '@/types';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CategoriaFormData {
  nome: string;
  descricao?: string;
  ativo?: string;
}

export const categoriaService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    search?: string;
    ativo?: string;
  }): Promise<PaginatedResponse<Categoria>> {
    // Filtrar parâmetros vazios/undefined
    const cleanParams: Record<string, any> = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.size) cleanParams.size = params.size;
    if (params?.search) cleanParams.search = params.search;
    if (params?.ativo) cleanParams.ativo = params.ativo;

    const response = await api.get('/equipamentos/categorias', { params: cleanParams });
    return response.data.data || response.data;
  },

  async getById(id: number): Promise<Categoria> {
    const response = await api.get(`/equipamentos/categorias/${id}`);
    return response.data.data || response.data;
  },

  async create(data: CategoriaFormData): Promise<Categoria> {
    const response = await api.post('/equipamentos/categorias', data);
    return response.data.data || response.data;
  },

  async update(id: number, data: Partial<CategoriaFormData>): Promise<Categoria> {
    const response = await api.put(`/equipamentos/categorias/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipamentos/categorias/${id}`);
  },

  async toggleStatus(id: number): Promise<Categoria> {
    const response = await api.patch(`/equipamentos/categorias/${id}/toggle-status`);
    return response.data.data || response.data;
  },
};
