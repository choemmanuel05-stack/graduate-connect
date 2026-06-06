import React from 'react';
import { formatRelativeTime } from '../../utils/dateFormatter';
import { FollowButton } from '../common/FollowButton';

interface PostHeaderProps {
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
}

const roleColors: Record<string, { bg: string; color: string }> = {
  graduate:      { bg: 'rgba(29,78,216,0.1)',  color: '#3B82F6' },
  employer:      { bg: 'rgba(5,150,105,0.1)',  color: '#10B981' },
  administrator: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
};

export const PostHeader: React.FC<PostHeaderProps> = ({ author, timestamp }) => {
  const initials = author.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const roleStyle = roleColors[author.role?.toLowerCase()] || roleColors.graduate;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
      {/* Avatar */}
      {author.avatar ? (
        <img
          src={author.avatar}
          alt={author.name}
          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #E2E8F0' }}
        />
      ) : (
        <div style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1D4ED8, #60A5FA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em',
          border: '2px solid rgba(29,78,216,0.2)',
        }}>
          {initials}
        </div>
      )}

      {/* Name + role + time + follow */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
            {author.name}
          </h3>
          <span style={{
            padding: '0.1rem 0.5rem', borderRadius: 99,
            background: roleStyle.bg, color: roleStyle.color,
            fontSize: '0.68rem', fontWeight: 700, textTransform: 'capitalize',
          }}>
            {author.role}
          </span>
          <FollowButton userId={author.id} size="sm" />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.15rem 0 0', fontWeight: 500 }}>
          {formatRelativeTime(timestamp)}
        </p>
      </div>
    </div>
  );
};
