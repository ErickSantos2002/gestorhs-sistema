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
    return response.data.data;
  },

  async getById(id: number): Promise<EquipamentoEmpresa> {
    const response = await api.get(`/equipamentos-empresa/${id}`);
    return response.data.data;
  },

  async getByEmpresa(empresaId: number): Promise<EquipamentoEmpresa[]> {
    const response = await api.get(`/empresas/${empresaId}/equipamentos`);
    return response.data.data;
  },

  async create(data: EquipamentoEmpresaFormData): Promise<EquipamentoEmpresa> {
    const response = await api.post('/equipamentos-empresa', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<EquipamentoEmpresaFormData>): Promise<EquipamentoEmpresa> {
    const response = await api.put(`/equipamentos-empresa/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipamentos-empresa/${id}`);
  },
};
