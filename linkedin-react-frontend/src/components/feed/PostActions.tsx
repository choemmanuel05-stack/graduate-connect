import React from 'react';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface PostActionsProps {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  likes,
  comments,
  shares,
  isLiked,
  onLike,
  onComment,
  onShare,
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-around gap-2">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
            isLiked ? 'text-[#0A66C2]' : 'text-[#6B7280]'
          }`}
        >
          <ThumbsUp className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium hidden sm:inline">Like</span>
          {likes > 0 && <span className="text-sm">({likes})</span>}
        </button>

        <button
          onClick={onComment}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 text-[#6B7280]"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Comment</span>
          {comments > 0 && <span className="text-sm">({comments})</span>}
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 text-[#6B7280]"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Share</span>
          {shares > 0 && <span className="text-sm">({shares})</span>}
        </button>
      </div>
    </div>
  );
};
