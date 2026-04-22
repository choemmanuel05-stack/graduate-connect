import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateFullName, validatePassword } from '../utils/validators';
import api from '../services/api';
import { Lock, User, CheckCircle } from 'lucide-react';

const Err: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.25rem' }}>⚠ {msg}</p> : null;

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // Profile section
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password section
  const [pwData, setPwData] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const nameErr = validateFullName(profileData.fullName);
    if (nameErr) errs.fullName = nameErr;
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return; }
    setProfileErrors({});
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await updateProfile({ fullName: profileData.fullName.trim() });
      setProfileMsg('Profile updated successfully!');
    } catch {
      setProfileMsg('Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!pwData.current) errs.current = 'Current password is required';
    const newPwErr = validatePassword(pwData.newPw);
    if (newPwErr) errs.newPw = newPwErr;
    if (pwData.newPw !== pwData.confirm) errs.confirm = 'Passwords do not match';
    if (pwData.current === pwData.newPw) errs.newPw = 'New password must be different from current password';
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setPwErrors({});
    setPwSaving(true);
    setPwMsg('');
    try {
      await api.post('/auth/password-change/', {
        current_password: pwData.current,
        new_password: pwData.newPw,
      });
      setPwMsg('Password changed successfully!');
      setPwData({ current: '', newPw: '', confirm: '' });
    } catch (err: any) {
      setPwErrors({ current: err?.response?.data?.error || 'Current password is incorrect' });
    } finally {
      setPwSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.875rem',
    background: 'var(--surface-2)', border: '1.5px solid var(--border-2)',
    borderRadius: 8, fontSize: '0.875rem', color: 'var(--text-primary)',
    fontFamily: 'inherit', outline: 'none',
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Account Settings</h1>

      {/* Profile section */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem', boxShadow: 'var(--s1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <User size={16} style={{ color: '#60A5FA' }} />
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Profile Information</h2>
        </div>

        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Full Name</label>
            <input value={profileData.fullName} onChange={e => { setProfileData(p => ({ ...p, fullName: e.target.value })); setProfileErrors({}); }}
              placeholder="Your full name" style={{ ...inputStyle, borderColor: profileErrors.fullName ? 'rgba(239,68,68,0.6)' : 'var(--border-2)' }}
              onFocus={e => { e.target.style.borderColor = '#60A5FA'; }}
              onBlur={e => { e.target.style.borderColor = profileErrors.fullName ? 'rgba(239,68,68,0.6)' : 'var(--border-2)'; }} />
            <Err msg={profileErrors.fullName} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Email</label>
            <input value={user?.email || ''} readOnly
              style={{ ...inputStyle, background: 'var(--surface-3)', color: '#64748B', cursor: 'default' }} />
            <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>Email cannot be changed</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Role</label>
            <input value={user?.role || ''} readOnly
              style={{ ...inputStyle, background: 'var(--surface-3)', color: '#64748B', cursor: 'default', textTransform: 'capitalize' }} />
            <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>Role cannot be changed</p>
          </div>

          {profileMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', background: profileMsg.includes('success') ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${profileMsg.includes('success') ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 8, fontSize: '0.82rem', color: profileMsg.includes('success') ? '#34D399' : '#FCA5A5' }}>
              {profileMsg.includes('success') && <CheckCircle size={14} />}{profileMsg}
            </div>
          )}

          <button type="submit" disabled={profileSaving}
            style={{ padding: '0.65rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: profileSaving ? 'not-allowed' : 'pointer', opacity: profileSaving ? 0.7 : 1 }}>
            {profileSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password section */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem', boxShadow: 'var(--s1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Lock size={16} style={{ color: '#F59E0B' }} />
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(['current', 'newPw', 'confirm'] as const).map((field) => {
            const labels: Record<string, string> = { current: 'Current Password', newPw: 'New Password', confirm: 'Confirm New Password' };
            const placeholders: Record<string, string> = { current: 'Enter current password', newPw: 'Min. 8 chars, include a number', confirm: 'Repeat new password' };
            return (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>{labels[field]}</label>
                <input type="password" value={pwData[field]}
                  onChange={e => { setPwData(p => ({ ...p, [field]: e.target.value })); setPwErrors(er => ({ ...er, [field]: '' })); }}
                  placeholder={placeholders[field]}
                  style={{ ...inputStyle, borderColor: pwErrors[field] ? 'rgba(239,68,68,0.6)' : 'var(--border-2)' }}
                  onFocus={e => { e.target.style.borderColor = '#60A5FA'; }}
                  onBlur={e => { e.target.style.borderColor = pwErrors[field] ? 'rgba(239,68,68,0.6)' : 'var(--border-2)'; }} />
                <Err msg={pwErrors[field]} />
              </div>
            );
          })}

          {pwMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, fontSize: '0.82rem', color: '#34D399' }}>
              <CheckCircle size={14} />{pwMsg}
            </div>
          )}

          <button type="submit" disabled={pwSaving}
            style={{ padding: '0.65rem', background: 'linear-gradient(135deg,#D97706,#F59E0B)', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: pwSaving ? 'not-allowed' : 'pointer', opacity: pwSaving ? 0.7 : 1 }}>
            {pwSaving ? 'Changing…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
