import api from './api';
import { LoginCredentials, LoginResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
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
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data.data;
  },

  async changePassword(senhaAtual: string, novaSenha: string): Promise<void> {
    await api.post('/auth/change-password', {
      senha_atual: senhaAtual,
      nova_senha: novaSenha,
    });
  },
};
