import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Logo from '../components/common/Logo';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/password-reset/confirm/', { token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid or expired reset link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: 'var(--s4)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo size="lg" />
        </div>

        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle size={32} style={{ color: '#34D399' }} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Password reset!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Redirecting you to login…</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.375rem' }}>Set new password</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Choose a strong password for your account.</p>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>New password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Min. 8 characters"
                    style={{ width: '100%', padding: '0.65rem 2.75rem 0.65rem 2.5rem', background: 'var(--surface-2)', border: '1.5px solid var(--border-2)', borderRadius: 10, fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#60A5FA'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Confirm password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                    placeholder="Repeat password"
                    style={{ width: '100%', padding: '0.65rem 0.875rem 0.65rem 2.5rem', background: 'var(--surface-2)', border: '1.5px solid var(--border-2)', borderRadius: 10, fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#60A5FA'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; }} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ padding: '0.75rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>

            <div style={{ height: 1, background: 'var(--border)', margin: '1.5rem 0' }} />
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#60A5FA', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
