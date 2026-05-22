import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, FileText, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface TabItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  tour?: string;
}

const graduateTabs: TabItem[] = [
  { to: '/',            label: 'Home',     icon: <Home size={20} />,     tour: 'home' },
  { to: '/jobs',        label: 'Find Jobs', icon: <Briefcase size={20} />, tour: 'jobs' },
  { to: '/cv-builder',  label: 'Build CV',  icon: <FileText size={20} />, tour: 'cv-builder' },
  { to: '/profile',     label: 'Profile',   icon: <User size={20} />,     tour: 'profile' },
];

const employerTabs: TabItem[] = [
  { to: '/',          label: 'Home',      icon: <Home size={20} /> },
  { to: '/jobs',      label: 'Jobs',      icon: <Briefcase size={20} /> },
  { to: '/graduates', label: 'Graduates', icon: <User size={20} /> },
  { to: '/dashboard', label: 'Dashboard', icon: <FileText size={20} /> },
];

/**
 * BottomTabBar — mobile-only bottom navigation.
 * Renders only on screens < 768px via CSS media query.
 * Replaces the hamburger menu for a more intuitive mobile UX.
 */
export const BottomTabBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const tabs = user?.role === 'employer' ? employerTabs : graduateTabs;

  return (
    <>
      {/* Spacer so content isn't hidden behind the tab bar */}
      <div className="md:hidden" style={{ height: 64 }} aria-hidden="true" />

      <nav
        className="md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          display: 'flex',
          alignItems: 'stretch',
          background: 'var(--surface, #1E293B)',
          borderTop: '1px solid var(--border, rgba(148,163,184,0.12))',
          zIndex: 40,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)', // iOS safe area
        }}
      >
        {tabs.map(tab => {
          const isActive = location.pathname === tab.to ||
            (tab.to !== '/' && location.pathname.startsWith(tab.to));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-tour={tab.tour}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary, #1D4ED8)' : 'var(--text-faint, #94A3B8)',
                fontSize: '0.65rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'color 150ms ease',
                minHeight: 44, // WCAG touch target
                minWidth: 44,
                position: 'relative',
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--color-primary, #1D4ED8)',
                  }}
                  aria-hidden="true"
                />
              )}
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default BottomTabBar;
