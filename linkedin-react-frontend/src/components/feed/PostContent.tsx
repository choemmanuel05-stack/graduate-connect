import React from 'react';

interface PostContentProps {
  content: string;
}

export const PostContent: React.FC<PostContentProps> = ({ content }) => {
  return (
    <div className="mt-4">
      <p className="text-[#1C1C1C] leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
};
