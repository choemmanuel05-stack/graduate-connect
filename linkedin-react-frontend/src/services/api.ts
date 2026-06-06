/**
 * api.ts
 * ------
 * Axios instance with:
 * - JWT Bearer token attached from memory (not localStorage in production)
 * - CSRF token automatically attached to all state-changing requests
 * - Auto-refresh on 401
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ── In-memory token store (more secure than localStorage) ────────────────────
let _accessToken: string | null = localStorage.getItem('accessToken'); // kept for backward compat during migration

export function setAccessToken(token: string | null) {
  _accessToken = token;
  // Keep localStorage for now so existing auth hooks don't break
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function getAccessToken(): string | null {
  return _accessToken;
}

// ── CSRF helper ───────────────────────────────────────────────────────────────
function getCSRFToken(): string {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return '';
}

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send cookies (CSRF, session) cross-origin
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  // Attach JWT
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach CSRF token for state-changing methods
  const method = (config.method || '').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrf = getCSRFToken();
    if (csrf) {
      config.headers['X-CSRFToken'] = csrf;
    }
  }

  return config;
});

// ── Response interceptor — auto-refresh on 401 ───────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;

    // Only attempt refresh once, and only for 401s that aren't the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh/')
    ) {
      original._retry = true;
      const refresh = localStorage.getItem('refreshToken');

      if (refresh) {
        try {
          const res = await axios.post(
            `${BASE_URL}/auth/refresh/`,
            { refresh },
            { withCredentials: true },
          );
          const newAccess: string = res.data.access;
          setAccessToken(newAccess);
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        } catch {
          // Refresh failed — clear tokens, stop retrying, redirect to login
          setAccessToken(null);
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('mockUser');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        // No refresh token — go to login
        setAccessToken(null);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
