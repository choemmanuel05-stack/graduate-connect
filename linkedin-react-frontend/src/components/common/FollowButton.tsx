/**
 * FollowButton
 * ------------
 * Reusable follow/unfollow toggle button.
 * Calls POST /api/users/<userId>/follow/ on the backend.
 * Shows "Follow" when not following, "Following" (with unfollow on hover) when following.
 */
import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, UserMinus } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface FollowButtonProps {
  userId: number | string;
  /** Initial state — pass if you already know it to avoid an extra API call */
  initialIsFollowing?: boolean;
  size?: 'sm' | 'md';
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialIsFollowing,
  size = 'sm',
}) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing ?? false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(initialIsFollowing !== undefined);

  // If initial state wasn't provided, fetch it
  useEffect(() => {
    if (checked || !user || String(userId) === String(user.id)) return;
    api.get(`/users/${userId}/follow/`)
      .then((res: any) => {
        setIsFollowing(res?.is_following ?? false);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [userId, user, checked]);

  // Don't show the button for your own profile
  if (!user || String(userId) === String(user.id)) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger card click
    if (loading) return;
    setLoading(true);
    const prev = isFollowing;
    setIsFollowing(!prev); // Optimistic
    try {
      const res: any = await api.post(`/users/${userId}/follow/`);
      setIsFollowing(res?.is_following ?? !prev);
    } catch {
      setIsFollowing(prev); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const isSm = size === 'sm';

  // Style based on state
  let bg = 'rgba(29,78,216,0.12)';
  let border = 'rgba(29,78,216,0.3)';
  let color = '#60A5FA';
  let label = 'Follow';
  let Icon = UserPlus;

  if (isFollowing) {
    if (hovered) {
      bg = 'rgba(239,68,68,0.1)';
      border = 'rgba(239,68,68,0.3)';
      color = '#FCA5A5';
      label = 'Unfollow';
      Icon = UserMinus;
    } else {
      bg = 'rgba(5,150,105,0.1)';
      border = 'rgba(5,150,105,0.3)';
      color = '#34D399';
      label = 'Following';
      Icon = UserCheck;
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: isSm ? '0.25rem 0.75rem' : '0.4rem 1rem',
        borderRadius: 99,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: isSm ? '0.72rem' : '0.8rem',
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all 150ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={isSm ? 12 : 14} />
      {label}
    </button>
  );
};
