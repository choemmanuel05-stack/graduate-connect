import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'graduate' | 'employer';
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: { id: number; email: string; role: string };
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/', { email, password });
    return response.data;
  },

  getMe: () => api.get('/auth/me/'),
};
