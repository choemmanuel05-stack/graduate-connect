import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/common/Logo';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { validateEmail } from '../utils/validators';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/');
    } catch (err: any) {
      const data = err?.response?.data;
      const status = err?.response?.status;

      if (data?.requires_verification) {
        // Account exists but email not verified — show a clear message with resend option
        setErrors({
          submit: `Your email address has not been verified yet. Please check your inbox for the verification link, or use the button below to resend it.`,
          unverified_email: email.trim().toLowerCase(),
        });
        return;
      }
      if (status === 429) {
        setErrors({ submit: data?.error || 'Too many login attempts. Please wait 15 minutes.' });
      } else if (status === 401 || status === 400) {
        setErrors({ submit: 'Invalid email or password. Please check your credentials and try again.' });
      } else if (!err?.response) {
        // No response at all — server is waking up (free tier spin-down)
        setErrors({ submit: 'The server is starting up, this can take up to 60 seconds on the free tier. Please wait a moment and try again.' });
      } else {
        setErrors({ submit: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', background: '#0F172A', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        background: '#1E293B', border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '440px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo size="lg" />
        </div>

        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.25rem', letterSpacing: '-0.025em' }}>
          Welcome back
        </h1>
        {/* FIXED: bright visible subtitle */}
        <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Sign in to your GraduateConnect account
        </p>

        {errors.submit && !errors.unverified_email && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#FCA5A5', fontSize: '0.875rem', fontWeight: 500 }}>
            {errors.submit}
          </div>
        )}

        {/* Unverified account — amber banner with resend option */}
        {errors.unverified_email && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1.25rem' }}>
            <p style={{ color: '#FCD34D', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Email not verified
            </p>
            <p style={{ color: '#FDE68A', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Your account exists but your email address has not been verified yet. Please check your inbox for the verification link.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';
                  await fetch(`${BASE_URL}/auth/resend-verification/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: errors.unverified_email, frontend_url: window.location.origin }),
                  });
                  setErrors(p => ({ ...p, resent: 'true' }));
                } catch { /* fail silently */ }
              }}
              style={{ padding: '0.4rem 0.875rem', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#FCD34D', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {errors.resent ? '✓ Verification email sent' : 'Resend Verification Email'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div>
            {/* FIXED: bright white label */}
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.4rem' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input type="email"
                style={{ width: '100%', padding: '0.65rem 0.875rem 0.65rem 2.5rem', background: '#263348', border: `1.5px solid ${errors.email ? 'rgba(239,68,68,0.6)' : 'rgba(148,163,184,0.25)'}`, borderRadius: '10px', fontSize: '0.875rem', color: '#F1F5F9', fontFamily: 'inherit', outline: 'none' }}
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
                onBlur={e => { const err = validateEmail(e.target.value); if (err) setErrors(p => ({ ...p, email: err })); }}
                onFocus={e => { e.target.style.borderColor = '#60A5FA'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.2)'; }}
              />
            </div>
            {errors.email && <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.3rem' }}>⚠ {errors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input type={showPw ? 'text' : 'password'}
                style={{ width: '100%', padding: '0.65rem 2.75rem 0.65rem 2.5rem', background: '#263348', border: `1.5px solid ${errors.password ? 'rgba(239,68,68,0.6)' : 'rgba(148,163,184,0.25)'}`, borderRadius: '10px', fontSize: '0.875rem', color: '#F1F5F9', fontFamily: 'inherit', outline: 'none' }}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.2)'; }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.3rem' }}>⚠ {errors.password}</p>}
            <div style={{ textAlign: 'right', marginTop: '0.375rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.75rem', marginTop: '0.25rem',
            background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '0.9375rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(96,165,250,0.4)', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ height: 1, background: 'rgba(148,163,184,0.15)', margin: '1.5rem 0' }} />
        {/* FIXED: visible footer text */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94A3B8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
