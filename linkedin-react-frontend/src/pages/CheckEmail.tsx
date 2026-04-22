import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Logo from '../components/common/Logo';

const CheckEmail: React.FC = () => {
  const [params] = useSearchParams();
  const email = params.get('email') || 'your email address';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 480, boxShadow: 'var(--s4)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo size="lg" />
        </div>

        {/* Animated envelope */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(16,185,129,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(96,165,250,0.25)' }}>
          <Mail size={36} style={{ color: '#60A5FA' }} />
        </div>

        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.625rem', letterSpacing: '-0.025em' }}>
          Check your email
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '0.5rem' }}>
          We've sent a verification link to:
        </p>
        <p style={{ fontWeight: 700, color: '#60A5FA', fontSize: '0.95rem', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
          {email}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          Click the link in the email to verify your address and activate your account. The link expires in <strong style={{ color: 'var(--text-primary)' }}>48 hours</strong>.
        </p>

        {/* Steps */}
        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left' }}>
          {[
            { step: '1', text: 'Open your email inbox' },
            { step: '2', text: 'Find the email from GraduateConnect' },
            { step: '3', text: 'Click "Verify Email Address"' },
            { step: '4', text: 'You\'ll be redirected to login' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(96,165,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#60A5FA', flexShrink: 0 }}>
                {item.step}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem' }}>
          Didn't receive it? Check your spam folder, or{' '}
          <Link to={`/resend-verification?email=${encodeURIComponent(email)}`}
            style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>
            resend the verification email
          </Link>
        </p>

        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.875rem', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    </div>
  );
};

export default CheckEmail;
