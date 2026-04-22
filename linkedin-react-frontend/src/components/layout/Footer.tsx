import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const Footer: React.FC = () => (
  <footer style={{ borderTop: '1px solid var(--border)', marginTop: '4rem', padding: '2rem 1rem', background: 'var(--surface-2)' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      <Logo size="sm" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', maxWidth: 400 }}>
        Connecting university graduates with job opportunities across Africa and beyond.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { to: '/terms', label: 'Terms of Use' },
          { to: '/privacy', label: 'Privacy Policy' },
          { to: '/help', label: 'Help' },
          { to: '/jobs', label: 'Browse Jobs' },
          { to: '/graduates', label: 'Find Graduates' },
        ].map(link => (
          <Link key={link.to} to={link.to}
            style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 150ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2563EB')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            {link.label}
          </Link>
        ))}
      </div>
      <p style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>
        © {new Date().getFullYear()} GraduateConnect. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
