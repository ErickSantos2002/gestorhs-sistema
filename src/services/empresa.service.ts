import api from './api';
import { Empresa, EmpresaFormData, PaginatedResponse } from '@/types';

interface ListEmpresasParams {
  page?: number;
  size?: number;
  razao_social?: string;
  cnpj_cpf?: string;
  tipo_pessoa?: 'PJ' | 'PF';
  status_contato?: 'ativo' | 'inativo' | 'perdido';
  ativo?: string;
}

export const empresaService = {
  async list(params?: ListEmpresasParams): Promise<PaginatedResponse<Empresa>> {
    const response = await api.get('/empresas', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Empresa> {
    const response = await api.get(`/empresas/${id}`);
    return response.data.data;
  },

  async create(data: EmpresaFormData): Promise<Empresa> {
    const response = await api.post('/empresas', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<EmpresaFormData>): Promise<Empresa> {
    const response = await api.put(`/empresas/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/empresas/${id}`);
  },

  async uploadLogo(id: number, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/empresas/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async getHistorico(id: number): Promise<any[]> {
    const response = await api.get(`/empresas/${id}/historico`);
    return response.data.data;
  },
};
