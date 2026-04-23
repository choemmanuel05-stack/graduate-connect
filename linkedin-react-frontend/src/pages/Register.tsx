import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/common/Logo';
import { Eye, EyeOff } from 'lucide-react';
import { validateEmail, validatePassword, validateFullName } from '../utils/validators';

const roles = [
  { value: 'graduate',      emoji: '🎓', label: 'Graduate',  desc: 'Find opportunities' },
  { value: 'employer',      emoji: '🏢', label: 'Employer',  desc: 'Hire top talent' },
  { value: 'administrator', emoji: '⚙️', label: 'Admin',     desc: 'Manage platform' },
];

// Inline error helper
const Err: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>⚠ {msg}</p> : null;

const Register: React.FC = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirm: '', role: 'graduate', agreed: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  // Validate a single field on blur
  const validateField = (k: string, value: string) => {
    let err = '';
    if (k === 'fullName') err = validateFullName(value);
    if (k === 'email')    err = validateEmail(value);
    if (k === 'password') err = validatePassword(value);
    if (k === 'confirm')  err = value !== form.password ? 'Passwords do not match' : '';
    if (err) setErrors(p => ({ ...p, [k]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const nameErr = validateFullName(form.fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateEmail(form.email);
    if (emailErr) newErrors.email = emailErr;

    const pwErr = validatePassword(form.password);
    if (pwErr) newErrors.password = pwErr;

    if (form.password !== form.confirm) newErrors.confirm = 'Passwords do not match';
    if (!form.agreed) newErrors.agreed = 'You must agree to the Terms of Use and Privacy Policy';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const res: any = await (register as any)({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        full_name: form.fullName.trim(),
        role: form.role as any,
        frontend_url: window.location.origin,
      });
      // Registration now requires email verification — show success screen
      if (res?.requires_verification) {
        navigate(`/check-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
      } else {
        navigate('/');
      }
    } catch {
      setErrors({ submit: 'Registration failed. This email may already be in use.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.6rem 0.875rem',
    background: 'var(--surface-2)',
    border: `1.5px solid ${hasErr ? 'rgba(239,68,68,0.6)' : 'var(--border-2)'}`,
    borderRadius: 8, fontSize: '0.875rem', color: 'var(--text-primary)',
    fontFamily: 'inherit', outline: 'none',
  });

  return (
    <div className="auth-bg" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="auth-card fade-up" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
          <Logo size="lg" />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Create your account</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Join graduates and employers on GraduateConnect
        </p>

        {errors.submit && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Full Name */}
          <div>
            <label className="field-label">Full Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(first &amp; last)</span></label>
            <input
              type="text" value={form.fullName} onChange={setField('fullName')}
              onBlur={e => validateField('fullName', e.target.value)}
              placeholder="e.g. Emmanuel Cho Tepi"
              style={inputStyle(!!errors.fullName)}
              onFocus={e => { e.target.style.borderColor = '#60A5FA'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.15)'; }}
            />
            <Err msg={errors.fullName} />
          </div>

          {/* Email */}
          <div>
            <label className="field-label">Email address</label>
            <input
              type="email" value={form.email} onChange={setField('email')}
              onBlur={e => validateField('email', e.target.value)}
              placeholder="you@example.com"
              style={inputStyle(!!errors.email)}
              onFocus={e => { e.target.style.borderColor = '#60A5FA'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.15)'; }}
            />
            <Err msg={errors.email} />
          </div>

          {/* Password + Confirm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="field-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={setField('password')}
                  onBlur={e => validateField('password', e.target.value)}
                  placeholder="Min. 8 chars"
                  style={{ ...inputStyle(!!errors.password), paddingRight: '2.5rem' }}
                  onFocus={e => { e.target.style.borderColor = '#60A5FA'; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <Err msg={errors.password} />
            </div>
            <div>
              <label className="field-label">Confirm</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'} value={form.confirm}
                  onChange={setField('confirm')}
                  onBlur={e => validateField('confirm', e.target.value)}
                  placeholder="Repeat"
                  style={{ ...inputStyle(!!errors.confirm), paddingRight: '2.5rem' }}
                  onFocus={e => { e.target.style.borderColor = '#60A5FA'; }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <Err msg={errors.confirm} />
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="field-label">I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {roles.map(r => (
                <label key={r.value} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.875rem 0.5rem',
                  borderRadius: 'var(--r-md)', cursor: 'pointer', textAlign: 'center',
                  border: `1.5px solid ${form.role === r.value ? 'var(--brand-light)' : 'var(--border-2)'}`,
                  background: form.role === r.value ? 'rgba(37,99,235,0.12)' : 'var(--bg-3)',
                  transition: 'all 150ms ease',
                }}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value}
                    onChange={() => setForm(p => ({ ...p, role: r.value }))} style={{ display: 'none' }} />
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{r.emoji}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: form.role === r.value ? '#93C5FD' : 'var(--text-secondary)' }}>{r.label}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{r.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input type="checkbox" id="agreed" checked={form.agreed}
                onChange={e => { setForm(p => ({ ...p, agreed: e.target.checked })); setErrors(p => ({ ...p, agreed: '' })); }}
                style={{ marginTop: '0.2rem', accentColor: '#60A5FA', width: 16, height: 16, flexShrink: 0 }} />
              <label htmlFor="agreed" style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5, cursor: 'pointer' }}>
                I agree to the{' '}
                <a href="/terms" target="_blank" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Terms of Use</a>
                {' '}and{' '}
                <a href="/privacy" target="_blank" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
              </label>
            </div>
            <Err msg={errors.agreed} />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
