import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService, RegisterData } from '../services/authService';

interface User {
  id: number | string;
  email: string;
  role: string;
  fullName?: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    try {
      const data = await authService.getMe();
      setUser({ id: data.id, email: data.email, role: data.role, profile: data.profile });
    } catch {
      // Try mock fallback
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) setUser(JSON.parse(mockUser));
      else { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('accessToken', res.access);
      localStorage.setItem('refreshToken', res.refresh);
      setUser({ id: res.user.id, email: res.user.email, role: res.user.role });
    } catch (err: any) {
      // Re-throw so Login page can inspect the error (e.g. requires_verification)
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res: any = await authService.register(data);
      // If requires_verification, don't log in — just return the response
      if (res?.requires_verification) {
        return res;
      }
      localStorage.setItem('accessToken', res.access);
      localStorage.setItem('refreshToken', res.refresh);
      setUser({ id: res.user.id, email: res.user.email, role: res.user.role });
      return res;
    } catch {
      // Mock fallback for dev without backend
      const mockUser: User = {
        id: Date.now(),
        email: data.email,
        role: data.role,
        fullName: data.full_name,
      };
      localStorage.setItem(`mockUser_${data.email}`, JSON.stringify(mockUser));
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return { requires_verification: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
