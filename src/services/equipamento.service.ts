import api from './api';
import { Equipamento, EquipamentoFormData, PaginatedResponse, Categoria, Marca } from '@/types';

interface ListEquipamentosParams {
  page?: number;
  size?: number;
  descricao?: string;
  codigo?: string;
  categoria_id?: number;
  marca_id?: number;
  ativo?: string;
}

export const equipamentoService = {
  async list(params?: ListEquipamentosParams): Promise<PaginatedResponse<Equipamento>> {
    const response = await api.get('/equipamentos', { params });
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

  async getById(id: number): Promise<Equipamento> {
    const response = await api.get(`/equipamentos/${id}`);
    return response.data.data;
  },

  async create(data: EquipamentoFormData): Promise<Equipamento> {
    const response = await api.post('/equipamentos', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<EquipamentoFormData>): Promise<Equipamento> {
    const response = await api.put(`/equipamentos/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipamentos/${id}`);
  },

  async uploadImagem(id: number, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/equipamentos/${id}/imagem`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async uploadVideo(id: number, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/equipamentos/${id}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Categorias
  async listCategorias(): Promise<Categoria[]> {
    const response = await api.get('/equipamentos/categorias', {
      params: { size: 100 }, // Buscar todas as categorias
    });
    const data = response.data.data || response.data;

    // Se vier com paginação, extrair apenas items
    if (data.items) {
      return data.items;
    }

    return data;
  },

  async createCategoria(data: { nome: string; descricao?: string }): Promise<Categoria> {
    const response = await api.post('/equipamentos/categorias', data);
    return response.data.data;
  },

  // Marcas
  async listMarcas(): Promise<Marca[]> {
    const response = await api.get('/equipamentos/marcas', {
      params: { size: 100 }, // Buscar todas as marcas
    });
    const data = response.data.data || response.data;

    // Se vier com paginação, extrair apenas items
    if (data.items) {
      return data.items;
    }

    return data;
  },

  async createMarca(data: { nome: string; descricao?: string }): Promise<Marca> {
    const response = await api.post('/equipamentos/marcas', data);
    return response.data.data;
  },
};
