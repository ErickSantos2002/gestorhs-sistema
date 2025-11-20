import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services';
import { User, LoginCredentials } from '@/types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  isPerfil: (perfil: string | string[]) => boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega usuário do localStorage na inicialização
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setLoading(false);
        return;
      }

      // Buscar dados atualizados do usuário
      const userData = await authService.getMe();
      setUser(userData);
    } catch (err) {
      // Token inválido ou expirado, limpar
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      // Salvar tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      // Salvar usuário
      setUser(response.usuario);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      // Limpar tokens do localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Lógica de permissões baseada no perfil
    const permissions: Record<string, string[]> = {
      admin: ['all'],
      gerente: ['read_all', 'write_limited'],
      tecnico: ['manage_os', 'manage_calibracao'],
      atendente: ['read_general', 'create_os'],
    };

    const userPermissions = permissions[user.perfil] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  const isPerfil = (perfil: string | string[]): boolean => {
    if (!user) return false;

    if (Array.isArray(perfil)) {
      return perfil.includes(user.perfil);
    }

    return user.perfil === perfil;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        signIn,
        signOut,
        updateUser,
        hasPermission,
        isPerfil,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
