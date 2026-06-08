import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { validateEmail, validatePassword, validateName, passwordStrength } from '../utils/validators';

// ── Inline error helper ───────────────────────────────────────────────────────
const Err: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      ⚠ {msg}
    </p>
  ) : null;

// ── Password strength bar ─────────────────────────────────────────────────────
const StrengthBar: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;
  const { score, label, color } = passwordStrength(password);
  const pct = Math.min((score / 5) * 100, 100);
  return (
    <div style={{ marginTop: '0.4rem' }}>
      <div style={{ height: 4, borderRadius: 99, background: 'rgba(148,163,184,0.2)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.3s ease, background 0.3s ease' }} />
      </div>
      <p style={{ fontSize: '0.7rem', color, marginTop: '0.2rem', fontWeight: 600 }}>{label}</p>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const Register: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirm: '', role: 'graduate',
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleToast, setGoogleToast] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleGoogleClick = () => {
    setGoogleToast(true);
    setTimeout(() => setGoogleToast(false), 3000);
  };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  // Validate on blur for immediate feedback
  const blurValidate = (k: string, value: string) => {
    let err = '';
    if (k === 'firstName') err = validateName(value, 'First name');
    if (k === 'lastName')  err = validateName(value, 'Surname');
    if (k === 'email')     err = validateEmail(value);
    if (k === 'password')  err = validatePassword(value);
    if (k === 'confirm')   err = value !== form.password ? 'Passwords do not match' : '';
    if (err) setErrors(p => ({ ...p, [k]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const fnErr = validateName(form.firstName, 'First name');
    if (fnErr) newErrors.firstName = fnErr;

    const lnErr = validateName(form.lastName, 'Surname');
    if (lnErr) newErrors.lastName = lnErr;

    const emailErr = validateEmail(form.email);
    if (emailErr) newErrors.email = emailErr;

    const pwErr = validatePassword(form.password);
    if (pwErr) newErrors.password = pwErr;

    if (!form.confirm) {
      newErrors.confirm = 'Please confirm your password';
    } else if (form.confirm !== form.password) {
      newErrors.confirm = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const res: any = await (register as any)({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        role: form.role as any,
        frontend_url: window.location.origin,
      });
      navigate('/');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data && typeof data === 'object') {
        const mapped: Record<string, string> = {};
        if (data.email)     mapped.email     = Array.isArray(data.email)     ? data.email[0]     : String(data.email);
        if (data.password)  mapped.password  = Array.isArray(data.password)  ? data.password[0]  : String(data.password);
        if (data.full_name) mapped.firstName = Array.isArray(data.full_name) ? data.full_name[0] : String(data.full_name);
        if (data.error)     mapped.submit    = String(data.error);
        if (Object.keys(mapped).length > 0) { setErrors(mapped); return; }
      }
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="auth-card fade-up" style={{ maxWidth: '460px' }}>

        {/* Coming Soon toast */}
        {googleToast && (
          <div style={{
            position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
            background: '#1E293B', border: '1px solid rgba(148,163,184,0.3)',
            borderRadius: '10px', padding: '0.75rem 1.25rem',
            color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            🚧 Google Sign-In is coming soon!
          </div>
        )}

        {/* ── Brand header ── */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--brand), var(--brand-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--s-brand)',
            }}>
              <span style={{ fontSize: '1.2rem' }}>🎓</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Graduate<span style={{ color: 'var(--brand-light)' }}>Connect</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Make the most of your professional life
          </p>
        </div>

        {/* ── Submit error banner — only for non-email errors ── */}
        {errors.submit && !errors.email && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', padding: '0.7rem 1rem', marginBottom: '1.25rem', color: '#FCA5A5', fontSize: '0.85rem' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* First Name */}
          <div>
            <label className="field-label">First Name</label>
            <input
              className="field"
              type="text"
              value={form.firstName}
              onChange={setField('firstName')}
              onBlur={e => blurValidate('firstName', e.target.value)}
              placeholder="First name"
              maxLength={75}
              autoComplete="given-name"
              style={{ borderColor: errors.firstName ? 'rgba(239,68,68,0.6)' : undefined }}
              onFocus={e => { e.target.style.borderColor = 'var(--brand-light)'; }}
            />
            <Err msg={errors.firstName} />
          </div>

          {/* Surname */}
          <div>
            <label className="field-label">Surname</label>
            <input
              className="field"
              type="text"
              value={form.lastName}
              onChange={setField('lastName')}
              onBlur={e => blurValidate('lastName', e.target.value)}
              placeholder="Surname"
              maxLength={75}
              autoComplete="family-name"
              style={{ borderColor: errors.lastName ? 'rgba(239,68,68,0.6)' : undefined }}
              onFocus={e => { e.target.style.borderColor = 'var(--brand-light)'; }}
            />
            <Err msg={errors.lastName} />
          </div>

          {/* Email */}
          <div>
            <label className="field-label">Email Address</label>
            <input
              className="field"
              type="email"
              value={form.email}
              onChange={setField('email')}
              onBlur={e => blurValidate('email', e.target.value)}
              placeholder="you@example.com"
              maxLength={254}
              autoComplete="email"
              style={{ borderColor: errors.email ? 'rgba(239,68,68,0.6)' : undefined }}
              onFocus={e => { e.target.style.borderColor = 'var(--brand-light)'; }}
            />
            <Err msg={errors.email} />
          </div>

          {/* Password + strength indicator */}
          <div>
            <label className="field-label">
              Password{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                (min 8 chars, must include a number)
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="field"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={setField('password')}
                onBlur={e => blurValidate('password', e.target.value)}
                placeholder="••••••••"
                maxLength={128}
                autoComplete="new-password"
                style={{ borderColor: errors.password ? 'rgba(239,68,68,0.6)' : undefined, paddingRight: '2.75rem' }}
                onFocus={e => { e.target.style.borderColor = 'var(--brand-light)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex', alignItems: 'center' }}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <StrengthBar password={form.password} />
            <Err msg={errors.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="field-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="field"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={setField('confirm')}
                onBlur={e => blurValidate('confirm', e.target.value)}
                placeholder="••••••••"
                maxLength={128}
                autoComplete="new-password"
                style={{ borderColor: errors.confirm ? 'rgba(239,68,68,0.6)' : undefined, paddingRight: '2.75rem' }}
                onFocus={e => { e.target.style.borderColor = 'var(--brand-light)'; }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(p => !p)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex', alignItems: 'center' }}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Live match indicator */}
            {form.confirm && (
              <p style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: form.confirm === form.password ? '#22C55E' : '#FCA5A5', fontWeight: 600 }}>
                {form.confirm === form.password ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
            <Err msg={errors.confirm} />
          </div>

          {/* Agree & Join */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.9375rem', borderRadius: 'var(--r-pill)', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating account…' : 'Agree & Join'}
          </button>

          {/* Terms */}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, margin: '0.25rem 0' }}>
            By clicking Agree &amp; Join, you agree to the{' '}
            <Link to="/terms" style={{ color: 'var(--brand-light)', textDecoration: 'none', fontWeight: 600 }}>Terms</Link>
            ,{' '}
            <Link to="/privacy" style={{ color: 'var(--brand-light)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
            {' '}and{' '}
            <Link to="/cookies" style={{ color: 'var(--brand-light)', textDecoration: 'none', fontWeight: 600 }}>Cookie Policy</Link>
          </p>

          {/* OR divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-2)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-2)' }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleClick}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', borderRadius: 'var(--r-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', opacity: 0.7, cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
            <span style={{ fontSize: '0.7rem', background: 'rgba(148,163,184,0.2)', padding: '0.15rem 0.5rem', borderRadius: '99px', marginLeft: '0.25rem' }}>Coming Soon</span>
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand-light)', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
