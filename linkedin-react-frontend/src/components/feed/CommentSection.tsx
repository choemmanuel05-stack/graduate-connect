import React, { useState } from 'react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  isLoading: boolean;
  onAddComment: (content: string) => Promise<void>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  isLoading,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(commentText);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* Comment input */}
      <div className="flex gap-2 mb-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent resize-none"
          rows={2}
        />
        <Button
          onClick={handleSubmit}
          disabled={!commentText.trim() || isSubmitting}
          isLoading={isSubmitting}
          className="self-end"
        >
          Post
        </Button>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const initials = comment.author.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2);

            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar src={comment.author.avatar} initials={initials} size="sm" />
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-sm text-[#1C1C1C]">
                    {comment.author.name}
                  </p>
                  <p className="text-sm text-[#1C1C1C] mt-1">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
