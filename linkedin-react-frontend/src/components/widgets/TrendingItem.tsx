import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../common/Avatar';
import { Hash } from 'lucide-react';

interface TrendingItemProps {
  item: {
    id: string;
    type: 'topic' | 'user';
    hashtag?: string;
    postCount?: number;
    name?: string;
    role?: string;
    avatar?: string;
  };
}

export const TrendingItem: React.FC<TrendingItemProps> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.type === 'topic' && item.hashtag) {
      navigate(`/search?q=${encodeURIComponent(item.hashtag)}`);
    } else if (item.type === 'user' && item.id) {
      navigate(`/profile/${item.id}`);
    }
  };

  if (item.type === 'topic') {
    return (
      <div
        onClick={handleClick}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
      >
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <Hash className="w-5 h-5 text-[#0A66C2]" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-[#1C1C1C]">{item.hashtag}</p>
          <p className="text-xs text-[#6B7280]">{item.postCount} posts</p>
        </div>
      </div>
    );
  }

  const initials = item.name
    ? item.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
    : '';

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
    >
      <Avatar src={item.avatar} initials={initials} size="sm" />
      <div className="flex-1">
        <p className="font-medium text-[#1C1C1C]">{item.name}</p>
        <p className="text-xs text-[#6B7280]">{item.role}</p>
      </div>
    </div>
  );
};
