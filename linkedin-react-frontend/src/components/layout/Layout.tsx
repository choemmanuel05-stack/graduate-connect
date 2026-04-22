import React from 'react';
import { Navbar } from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Briefcase, FileText, User, LayoutDashboard } from 'lucide-react';

// Inline CV icon for bottom nav
const CVNavIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="11" height="15" rx="2" stroke="currentColor" strokeWidth="1.75" fill="none"/>
    <path d="M7 7h5M7 10h5M7 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 14l2 2 3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const graduateNav = [
    { to: '/', icon: Home, label: 'Home', custom: false },
    { to: '/jobs', icon: Briefcase, label: 'Jobs', custom: false },
    { to: '/cv-builder', icon: null, label: 'CV', custom: true },
    { to: '/profile', icon: User, label: 'Profile', custom: false },
  ];
  const employerNav = [
    { to: '/', icon: Home, label: 'Home', custom: false },
    { to: '/jobs', icon: Briefcase, label: 'Jobs', custom: false },
    { to: '/graduates', icon: User, label: 'Talent', custom: false },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', custom: false },
  ];
  const adminNav = [
    { to: '/', icon: Home, label: 'Home', custom: false },
    { to: '/admin', icon: LayoutDashboard, label: 'Admin', custom: false },
  ];

  const navItems = user?.role === 'employer' ? employerNav : user?.role === 'administrator' ? adminNav : graduateNav;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem', width: '100%', paddingBottom: '5rem' }}>
        {children}
      </main>
      <Footer />

      {/* Mobile bottom navigation */}
      <nav style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(148,163,184,0.12)', zIndex: 50, padding: '0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))' }}
        className="mobile-bottom-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <button key={item.to} onClick={() => navigate(item.to)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0.375rem 0', background: 'none', border: 'none', cursor: 'pointer', color: active ? '#60A5FA' : '#64748B', transition: 'color 150ms' }}>
              {item.custom ? <CVNavIcon /> : Icon ? <Icon size={20} /> : null}
              <span style={{ fontSize: '0.62rem', fontWeight: active ? 700 : 500 }}>{item.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#60A5FA' }} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
