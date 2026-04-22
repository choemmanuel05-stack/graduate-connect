import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const navigate = useNavigate();

  const sizes = {
    sm: { icon: 32, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 44, text: 'text-2xl', gap: 'gap-3' },
    lg: { icon: 60, text: 'text-4xl', gap: 'gap-3.5' },
  };

  const s = sizes[size];

  return (
    <div
      onClick={() => navigate('/')}
      className={`flex items-center ${s.gap} cursor-pointer select-none ${className}`}
    >
      {/* SVG Icon Mark */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gc-grad-1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A66C2" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="gc-grad-2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Background rounded square */}
        <rect width="48" height="48" rx="12" fill="url(#gc-grad-1)" />

        {/* Graduation cap - top */}
        <polygon points="24,8 38,15 24,22 10,15" fill="url(#gc-grad-2)" />
        <rect x="21" y="22" width="6" height="2" rx="1" fill="url(#gc-grad-2)" />

        {/* Diploma/scroll shape */}
        <rect x="14" y="26" width="20" height="13" rx="3" fill="url(#gc-grad-2)" opacity="0.85" />
        <line x1="18" y1="30" x2="30" y2="30" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="33" x2="30" y2="33" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="36" x2="25" y2="36" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" />

        {/* Connection dot - top right */}
        <circle cx="40" cy="10" r="4" fill="#0D9488" opacity="0.9" />
        <circle cx="40" cy="10" r="2" fill="white" opacity="0.8" />
      </svg>

      {/* Wordmark */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight ${s.text} bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent`}>
            Graduate
          </span>
          <span className={`font-semibold tracking-widest ${size === 'lg' ? 'text-sm' : 'text-xs'} text-slate-400 uppercase`}>
            Connect
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
