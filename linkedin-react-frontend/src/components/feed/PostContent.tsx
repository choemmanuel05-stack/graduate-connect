import React, { useState } from 'react';

interface PostContentProps {
  content: string;
}

const PREVIEW_LENGTH = 280;

export const PostContent: React.FC<PostContentProps> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > PREVIEW_LENGTH;
  const displayed = isLong && !expanded ? content.slice(0, PREVIEW_LENGTH) + '…' : content;

  return (
    <div style={{ marginTop: '0.875rem' }}>
      <p style={{
        fontSize: '0.9375rem',
        color: '#1E293B',
        lineHeight: 1.65,
        whiteSpace: 'pre-wrap',
        margin: 0,
        wordBreak: 'break-word',
      }}>
        {displayed}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(p => !p)}
          style={{ marginTop: '0.35rem', background: 'none', border: 'none', color: '#0A66C2', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          {expanded ? 'Show less' : 'See more'}
        </button>
      )}
    </div>
  );
};
