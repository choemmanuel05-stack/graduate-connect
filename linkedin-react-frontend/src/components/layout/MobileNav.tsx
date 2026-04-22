import React from 'react';
import { X, Home, Briefcase, GraduationCap, User, Settings, LogOut, LayoutDashboard, FileText } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../common/Logo';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const go = (path: string) => { navigate(path); onClose(); };

  const graduateLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/jobs', label: 'Jobs', icon: <Briefcase size={18} /> },
    { to: '/applications', label: 'My Applications', icon: <FileText size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];
  const employerLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/jobs', label: 'Browse Jobs', icon: <Briefcase size={18} /> },
    { to: '/graduates', label: 'Graduates', icon: <GraduationCap size={18} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];
  const adminLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/jobs', label: 'Jobs', icon: <Briefcase size={18} /> },
    { to: '/graduates', label: 'Graduates', icon: <GraduationCap size={18} /> },
    { to: '/admin', label: 'Admin Panel', icon: <LayoutDashboard size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const links = user?.role === 'employer' ? employerLinks : user?.role === 'administrator' ? adminLinks : graduateLinks;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col"
        style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border-2)', boxShadow: 'var(--s4)' }}>

        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size="sm" />
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                {(user.fullName || user.email || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user.fullName || user.email}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
          {links.map(link => (
            <button key={link.to} onClick={() => go(link.to)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.25rem', transition: 'all 150ms ease', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              <span style={{ color: '#60A5FA' }}>{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => { logout(); navigate('/login'); onClose(); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', color: '#FCA5A5', fontSize: '0.9rem', fontWeight: 600 }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};
