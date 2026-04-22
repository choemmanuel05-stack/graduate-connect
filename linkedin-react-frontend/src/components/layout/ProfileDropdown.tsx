import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, LayoutDashboard, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initials = (user?.fullName || user?.email || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const go = (path: string) => { navigate(path); setOpen(false); };

  const menuItems = [
    ...(user?.role === 'graduate' ? [
      { icon: <User size={14} />, label: 'My Profile', path: '/profile' },
      { icon: <FileText size={14} />, label: 'Applications', path: '/applications' },
    ] : []),
    ...(user?.role === 'employer' ? [{ icon: <LayoutDashboard size={14} />, label: 'Dashboard', path: '/dashboard' }] : []),
    ...(user?.role === 'administrator' ? [{ icon: <LayoutDashboard size={14} />, label: 'Admin Panel', path: '/admin' }] : []),
    { icon: <Settings size={14} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.625rem', borderRadius: 'var(--r-md)', background: open ? 'var(--surface-2)' : 'transparent', border: '1px solid transparent', cursor: 'pointer', transition: 'all 150ms ease' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}>
        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{initials}</div>
        <ChevronDown size={13} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 220, background: 'var(--surface)',
          border: '1px solid var(--border-2)', borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--s4)', zIndex: 50, overflow: 'hidden',
          animation: 'popIn 0.15s ease',
        }}>
          {/* User info */}
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {user?.fullName || user?.email}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: '0.1rem' }}>
              {user?.role}
            </p>
          </div>

          {/* Menu items */}
          <div style={{ padding: '0.375rem' }}>
            {menuItems.map(item => (
              <button key={item.path} onClick={() => go(item.path)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--r-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, transition: 'all 100ms ease', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div style={{ padding: '0.375rem', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => { logout(); navigate('/login'); setOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--r-sm)', background: 'none', border: 'none', cursor: 'pointer', color: '#FCA5A5', fontSize: '0.875rem', fontWeight: 500, transition: 'all 100ms ease', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
