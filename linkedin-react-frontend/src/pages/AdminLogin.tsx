import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react';
import api from '../services/api';

const AdminLogin: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res: any = await api.post('/auth/login/', { email, password });

      const role      = res?.user?.role;
      const isStaff   = res?.user?.is_staff;

      // Only allow administrator role or Django staff
      if (role !== 'administrator' && !isStaff) {
        setError('Access denied. This portal is for administrators only.');
        setLoading(false);
        return;
      }

      // Store tokens under admin-specific keys so they don't clash with the main app
      localStorage.setItem('adminAccessToken',  res.access);
      localStorage.setItem('adminRefreshToken', res.refresh);
      localStorage.setItem('adminUser',         JSON.stringify(res.user));

      navigate('/admin-panel');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Login failed. Check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(30,41,59,0.95)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 16,
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>
            <ShieldCheck size={32} color="#fff" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            Admin Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Graduate-Connect — Restricted Access
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 8, padding: '0.75rem 1rem',
            color: '#fca5a5', fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={{
                width: '100%', padding: '0.7rem 0.875rem',
                background: 'rgba(15,23,42,0.8)',
                border: '1.5px solid rgba(99,102,241,0.3)',
                borderRadius: 8, color: '#f1f5f9',
                fontSize: '0.9rem', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.3)'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '0.7rem 2.75rem 0.7rem 0.875rem',
                  background: 'rgba(15,23,42,0.8)',
                  border: '1.5px solid rgba(99,102,241,0.3)',
                  borderRadius: 8, color: '#f1f5f9',
                  fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.3)'}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', padding: 0,
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.8rem',
              marginTop: '0.5rem',
              background: loading
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: '0.95rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'all 200ms',
            }}
          >
            <Lock size={16} />
            {loading ? 'Signing in…' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          Not an administrator?{' '}
          <a href="/#/login" style={{ color: '#6366f1', textDecoration: 'none' }}>
            Go to main app
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
