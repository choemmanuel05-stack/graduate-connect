import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'graduate' | 'employer';
  frontend_url?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: { id: number; email: string; role: string };
  requires_verification?: boolean;
  email?: string;
}

export const authService = {
  // api interceptor already unwraps response.data, so these return the payload directly
  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register/', data) as unknown as Promise<AuthResponse>,

  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login/', { email, password }) as unknown as Promise<AuthResponse>,

  getMe: () => api.get('/auth/me/'),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }).catch(() => {}),
};
