import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';
import api from '../services/api';
import Logo from '../components/common/Logo';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
    api.post('/auth/verify-email/', { token })
      .then((res: any) => {
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
        // Auto-redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch((err: any) => {
        const msg = err?.response?.data?.error || 'Verification failed.';
        if (msg.toLowerCase().includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
        setMessage(msg);
      });
  }, [token, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: 'var(--s4)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo size="lg" />
        </div>

        {status === 'loading' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(96,165,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Loader size={32} style={{ color: '#60A5FA', animation: 'spin 1s linear infinite' }} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Verifying your email…</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle size={32} style={{ color: '#34D399' }} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Email Verified! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your email has been verified. Redirecting you to login…
            </p>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', borderRadius: 10, color: '#fff', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
              Go to Login
            </Link>
          </>
        )}

        {status === 'expired' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Mail size={32} style={{ color: '#F59E0B' }} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Link Expired</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{message}</p>
            <Link to="/resend-verification" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 10, color: '#FCD34D', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
              <Mail size={16} /> Resend Verification Email
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <XCircle size={32} style={{ color: '#EF4444' }} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{message}</p>
            <Link to="/login" style={{ color: '#60A5FA', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>← Back to login</Link>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default VerifyEmail;
