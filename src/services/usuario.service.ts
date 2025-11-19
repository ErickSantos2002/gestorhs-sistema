import api from './api';
import { User, PaginatedResponse } from '@/types';

export interface UsuarioFormData {
  nome: string;
  login: string;
  email: string;
  senha?: string;
  perfil: 'admin' | 'gerente' | 'tecnico' | 'atendente';
  ativo: string;
  imagem?: string;
}

export const usuarioService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    search?: string;
    perfil?: string;
    ativo?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get('/usuarios', { params });
    return response.data.data || response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data.data || response.data;
  },

  async create(data: UsuarioFormData): Promise<User> {
    const response = await api.post('/usuarios', data);
    return response.data.data || response.data;
  },

  async update(id: number, data: Partial<UsuarioFormData>): Promise<User> {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },

  async toggleStatus(id: number): Promise<User> {
    const response = await api.patch(`/usuarios/${id}/toggle-status`);
    return response.data.data || response.data;
  },

  async changePassword(id: number, novaSenha: string): Promise<void> {
    await api.patch(`/usuarios/${id}/change-password`, {
      nova_senha: novaSenha,
    });
  },

  async uploadAvatar(id: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('imagem', file);

    const response = await api.post(`/usuarios/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data?.url || response.data.url;
  },
};
