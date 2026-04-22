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
  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register/', data),

  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login/', { email, password }),

  getMe: () => api.get('/auth/me/'),
};
