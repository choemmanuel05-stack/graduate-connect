import React, { useState } from 'react';
import { Menu, Briefcase, Home, LayoutDashboard, User, FileText, X, GraduationCap, MessageSquare, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { ProfileDropdown } from './ProfileDropdown';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../common/Logo';
import { NotificationBell } from '../common/NotificationBell';

// Custom CV icon that looks like a native app icon
const CVIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="11" height="15" rx="2" stroke="currentColor" strokeWidth="1.75" fill="none"/>
    <path d="M7 7h5M7 10h5M7 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 14l2 2 3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  const graduateLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/jobs', label: 'Jobs', icon: <Briefcase size={16} /> },
    { to: '/applications', label: 'Applications', icon: <FileText size={16} /> },
    { to: '/interview-prep', label: 'Interview', icon: <MessageSquare size={16} /> },
  ];
  const employerLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/jobs', label: 'Jobs', icon: <Briefcase size={16} /> },
    { to: '/graduates', label: 'Graduates', icon: <GraduationCap size={16} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  ];
  const adminLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/jobs', label: 'Jobs', icon: <Briefcase size={16} /> },
    { to: '/graduates', label: 'Graduates', icon: <GraduationCap size={16} /> },
    { to: '/admin', label: 'Admin', icon: <LayoutDashboard size={16} /> },
  ];
  const links = user?.role === 'employer' ? employerLinks : user?.role === 'administrator' ? adminLinks : graduateLinks;

  return (
    <>
      <nav className="navbar sticky top-0 z-50 h-16" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <Logo size="md" />

          <div className="hidden md:block flex-1 max-w-xs" role="search">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center gap-1" role="menubar">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
                role="menuitem"
                aria-current={location.pathname === l.to ? 'page' : undefined}>
                {l.icon}
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block"><NotificationBell /></div>
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: theme === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${theme === 'light' ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', transition: 'all 150ms ease',
                color: theme === 'light' ? '#475569' : '#94A3B8',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = theme === 'light' ? 'rgba(15,23,42,0.14)' : 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = theme === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)'; }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="hidden md:block"><ProfileDropdown /></div>
            <button onClick={() => setOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={open}>
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-4">
              <Logo size="sm" />
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === l.to
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}>
                {l.icon} {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
