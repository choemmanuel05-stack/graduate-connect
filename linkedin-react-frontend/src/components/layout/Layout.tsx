import React from 'react';
import { Navbar } from './Navbar';
import Footer from './Footer';
import { BottomTabBar } from './BottomTabBar';

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem', width: '100%' }}>
        {children}
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Layout;
