import React, { useState } from 'react';
import { Post } from '../../types/post';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';
import { CommentSection } from './CommentSection';
import { postService } from '../../services/postService';

interface PostCardProps {
  post: Post;
  onUpdate: (postId: string, updates: Partial<Post>) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const handleLike = async () => {
    try {
      await postService.likePost(post.id);
      onUpdate(post.id, {
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      });
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async () => {
    if (!isCommentSectionOpen) {
      setIsCommentSectionOpen(true);
      setIsLoadingComments(true);
      try {
        const fetchedComments = await postService.getComments(post.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    } else {
      setIsCommentSectionOpen(false);
    }
  };

  const handleShare = () => {
    // TODO: Implement share modal
    console.log('Share post:', post.id);
  };

  const handleAddComment = async (content: string) => {
    const newComment = await postService.addComment(post.id, content);
    setComments([...comments, newComment]);
    onUpdate(post.id, { comments: post.comments + 1 });
  };

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '1.25rem', marginBottom: '0.75rem', border: '1px solid rgba(148,163,184,0.15)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'box-shadow 200ms ease' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)')}>
      <PostHeader author={post.author} timestamp={post.timestamp} />
      <PostContent content={post.content} />
      <PostActions
        likes={post.likes}
        comments={post.comments}
        shares={post.shares}
        isLiked={post.isLiked}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />
      {isCommentSectionOpen && (
        <CommentSection
          postId={post.id}
          comments={comments}
          isLoading={isLoadingComments}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};
