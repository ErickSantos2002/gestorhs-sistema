import api from './api';
import { LoginCredentials, LoginResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    // Backend retorna diretamente os dados, não em response.data.data
    const loginData = response.data;

    // Se o backend não retornar o usuario, buscar depois
    if (!loginData.usuario) {
      // Salvar token temporariamente para fazer a requisição
      const tempToken = loginData.access_token;
      const originalHeader = api.defaults.headers.common['Authorization'];

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${tempToken}`;
        const userResponse = await api.get('/auth/me');
        loginData.usuario = userResponse.data.data || userResponse.data;
      } finally {
        if (originalHeader) {
          api.defaults.headers.common['Authorization'] = originalHeader;
        } else {
          delete api.defaults.headers.common['Authorization'];
        }
      }
    }

    return loginData;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data || response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data.data || response.data;
  },

  async changePassword(senhaAtual: string, novaSenha: string): Promise<void> {
    await api.post('/auth/change-password', {
      senha_atual: senhaAtual,
      nova_senha: novaSenha,
    });
  },
};
