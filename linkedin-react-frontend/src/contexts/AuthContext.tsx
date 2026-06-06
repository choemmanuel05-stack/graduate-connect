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

    // Clear obviously fake tokens left over from the old mock fallback
    if (!token || token === 'mock-token' || token.startsWith('mock')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('mockUser');
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      setUser({ id: data.id, email: data.email, role: data.role, profile: data.profile });
    } catch {
      // Token is invalid/expired — clear everything and show login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('mockUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const res: any = await authService.login(email, password);
      if (res?.access) {
        localStorage.setItem('accessToken', res.access);
        localStorage.setItem('refreshToken', res.refresh);
        setUser({ id: res.user.id, email: res.user.email, role: res.user.role });
      }
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    // Always call the real backend — never fall back to mock on error.
    // Errors (400 duplicate, 429 rate limit, etc.) must be re-thrown so
    // the Register page can inspect and display them.
    const res: any = await authService.register(data);

    // If email verification is required, return without logging in
    if (res?.requires_verification) {
      return res;
    }

    // Normal registration that returns tokens immediately
    if (res?.access) {
      localStorage.setItem('accessToken', res.access);
      localStorage.setItem('refreshToken', res.refresh);
      setUser({ id: res.user.id, email: res.user.email, role: res.user.role });
    }

    return res;
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
