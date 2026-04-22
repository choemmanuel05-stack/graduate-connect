import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import Logo from '../components/common/Logo';
import { validateEmail } from '../utils/validators';

const ResendVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/resend-verification/', {
        email: email.trim().toLowerCase(),
        frontend_url: window.location.origin,
      });
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
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

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle size={32} style={{ color: '#34D399' }} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Check your inbox</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              A new verification link has been sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.<br />
              Check your inbox and spam folder. The link expires in 48 hours.
            </p>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60A5FA', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={22} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Resend Verification</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Get a new verification link</p>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} required
                    placeholder="you@example.com"
                    style={{ width: '100%', padding: '0.65rem 0.875rem 0.65rem 2.5rem', background: 'var(--surface-2)', border: '1.5px solid var(--border-2)', borderRadius: 10, fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#60A5FA'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              <button type="submit" disabled={loading || !email.trim()}
                style={{ padding: '0.75rem', background: 'linear-gradient(135deg,#D97706,#F59E0B)', border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(217,119,6,0.4)' }}>
                {loading ? 'Sending…' : 'Send New Verification Link'}
              </button>
            </form>

            <div style={{ height: 1, background: 'var(--border)', margin: '1.5rem 0' }} />
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#60A5FA', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;
