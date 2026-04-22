import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ArrowUpRight } from 'lucide-react';

export const ProfileWidget: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const name = user.fullName || user.email || 'User';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const path = user.role === 'employer' ? '/dashboard' : user.role === 'administrator' ? '/admin' : '/profile';

  return (
    <div className="card card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(path)}>
      {/* Banner */}
      <div style={{ height: 56, background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #7C3AED 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
      </div>

      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        {/* Avatar */}
        <div className="avatar" style={{ width: 52, height: 52, fontSize: '1.125rem', marginTop: -26, marginBottom: '0.75rem' }}>
          {initials}
        </div>

        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{name}</p>
        <span className="badge badge-blue" style={{ marginTop: '0.375rem', textTransform: 'capitalize' }}>{user.role}</span>

        {user.profile?.university && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{user.profile.university}</p>
        )}
        {user.profile?.company_name && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{user.profile.company_name}</p>
        )}

        <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: '#60A5FA', fontWeight: 600 }}>View Profile</span>
          <ArrowUpRight size={14} style={{ color: '#60A5FA' }} />
        </div>
      </div>
    </div>
  );
};
