import React from 'react';
import { Avatar } from '../common/Avatar';
import { formatRelativeTime } from '../../utils/dateFormatter';

interface PostHeaderProps {
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ author, timestamp }) => {
  const initials = author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="flex items-start gap-3">
      <Avatar src={author.avatar} initials={initials} size="md" />
      <div className="flex-1">
        <h3 className="font-semibold text-[#1C1C1C]">{author.name}</h3>
        <p className="text-sm text-[#6B7280]">{author.role}</p>
        <p className="text-xs text-[#6B7280]">{formatRelativeTime(timestamp)}</p>
      </div>
    </div>
  );
};
