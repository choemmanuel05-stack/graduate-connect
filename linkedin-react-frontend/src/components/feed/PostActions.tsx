import React from 'react';
import { ThumbsUp, MessageCircle, Repeat2, Send } from 'lucide-react';

interface PostActionsProps {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isReposted?: boolean;
  onLike: () => void;
  onComment: () => void;
  onRepost: () => void;
  onSend: () => void;
  onShare?: () => void; // legacy compat
}

export const PostActions: React.FC<PostActionsProps> = ({
  likes,
  comments,
  shares,
  isLiked,
  isReposted = false,
  onLike,
  onComment,
  onRepost,
  onSend,
}) => {
  // Each button takes equal share of the row
  const base: React.CSSProperties = {
    flex: '1 1 0',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.2rem',
    padding: '0.5rem 0.1rem',
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#6B7280',
    transition: 'background 150ms ease',
    whiteSpace: 'nowrap',
    overflow: 'visible',   // never clip text
  };

  const hover = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.background = 'rgba(0,0,0,0.06)');
  const unhover = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.background = 'transparent');

  return (
    <div style={{
      marginTop: '0.875rem',
      paddingTop: '0.875rem',
      borderTop: '1px solid rgba(148,163,184,0.2)',
    }}>
      <div style={{ display: 'flex', width: '100%', gap: '0.125rem' }}>

        {/* Like */}
        <button
          onClick={onLike}
          style={{ ...base, color: isLiked ? '#0A66C2' : '#6B7280' }}
          onMouseEnter={hover}
          onMouseLeave={unhover}
          title="Like"
        >
          <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span>Like{likes > 0 ? ` (${likes})` : ''}</span>
        </button>

        {/* Comment */}
        <button
          onClick={onComment}
          style={base}
          onMouseEnter={hover}
          onMouseLeave={unhover}
          title="Comment"
        >
          <MessageCircle size={16} />
          <span>Comment{comments > 0 ? ` (${comments})` : ''}</span>
        </button>

        {/* Repost — always grey, dims after click */}
        <button
          onClick={onRepost}
          style={{
            ...base,
            opacity: isReposted ? 0.5 : 1,
            cursor: isReposted ? 'default' : 'pointer',
          }}
          onMouseEnter={e => { if (!isReposted) hover(e); }}
          onMouseLeave={e => { if (!isReposted) unhover(e); }}
          title={isReposted ? 'Already reposted' : 'Repost'}
          disabled={isReposted}
        >
          <Repeat2 size={16} />
          <span>Repost{shares > 0 ? ` (${shares})` : ''}</span>
        </button>

        {/* Send */}
        <button
          onClick={onSend}
          style={base}
          onMouseEnter={hover}
          onMouseLeave={unhover}
          title="Send"
        >
          <Send size={16} />
          <span>Send</span>
        </button>

      </div>
    </div>
  );
};
