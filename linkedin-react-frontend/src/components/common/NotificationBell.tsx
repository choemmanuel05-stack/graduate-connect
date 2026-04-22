import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface Notification {
  id: number;
  message: string;
  type: 'application' | 'job' | 'system';
  read: boolean;
  created_at: string;
}

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  // Poll for notifications every 30 seconds
  useEffect(() => {
    if (!user) return;
    const fetch = () => {
      api.get('/notifications/').then((res: any) => {
        setNotifications(res.results || []);
      }).catch(() => {
        // Mock notifications when backend not available
        setNotifications([
          { id: 1, message: 'Your application to TechCorp was reviewed', type: 'application', read: false, created_at: new Date().toISOString() },
          { id: 2, message: 'New job matching your skills: Data Analyst', type: 'job', read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
        ]);
      });
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    api.post('/notifications/mark-read/').catch(() => {});
  };

  const typeColors: Record<string, string> = {
    application: '#60A5FA',
    job: '#34D399',
    system: '#F59E0B',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: open ? 'var(--surface-2)' : 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 150ms ease' }}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}>
        <Bell size={18} />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, background: '#EF4444', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg)' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 320, background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--s4)', zIndex: 50, overflow: 'hidden', animation: 'popIn 0.15s ease' }}>
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: '0.75rem', color: '#60A5FA', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(96,165,250,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[n.type], flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
