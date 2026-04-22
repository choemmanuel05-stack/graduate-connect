/**
 * CVBuilderFAB — Floating Action Button for the CV Builder.
 * Sits above the AI chatbot button on every page.
 * Distinct teal/emerald color + document icon to differentiate from the blue AI button.
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CVDocIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Document body */}
    <rect x="4" y="2" width="12" height="17" rx="2.5" fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth="1.6"/>
    {/* Folded corner */}
    <path d="M13 2v4h3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Text lines */}
    <path d="M7 9h6M7 12h6M7 15h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Pen / edit indicator */}
    <path d="M17 17.5l1.5-1.5 1.5 1.5-1.5 1.5z" fill="white" opacity="0.9"/>
    <path d="M18.5 16l2-2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const CVBuilderFAB: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Only show for graduates (employers don't need a CV)
  if (!user || user.role !== 'graduate') return null;

  // Don't show on the CV Builder page itself
  if (location.pathname === '/cv-builder') return null;

  const handleClick = () => navigate('/cv-builder');

  return (
    <div style={{ position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
      {/* Always-visible label */}
      <span style={{
        fontSize: '0.65rem', fontWeight: 700, color: '#F1F5F9',
        background: 'rgba(13,148,136,0.85)', backdropFilter: 'blur(6px)',
        padding: '0.2rem 0.55rem', borderRadius: 99,
        border: '1px solid rgba(16,185,129,0.4)',
        letterSpacing: '0.03em', pointerEvents: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        CV Builder
      </span>

      {/* FAB button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => { setHovered(true); setShowTooltip(true); }}
        onMouseLeave={() => { setHovered(false); setShowTooltip(false); }}
        aria-label="Open CV Builder"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: hovered
            ? 'linear-gradient(145deg, #059669, #10B981)'
            : 'linear-gradient(145deg, #0D9488, #10B981)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered
            ? '0 6px 24px rgba(16,185,129,0.65)'
            : '0 4px 16px rgba(16,185,129,0.45)',
          transform: hovered ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
          transition: 'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
        }}
      >
        <CVDocIcon size={22} />

        {/* Pulse ring — draws attention on first visit */}
        <span style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '2px solid rgba(16,185,129,0.4)',
          animation: 'cvPulse 2.5s ease-out infinite',
          pointerEvents: 'none',
        }}/>
      </button>

      <style>{`
        @keyframes cvPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
