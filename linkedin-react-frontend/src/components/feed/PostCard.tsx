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
  const [isReposted, setIsReposted] = useState(false);
  const [sendToast, setSendToast] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [showSendModal, setShowSendModal] = useState(false);

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

  const handleRepost = async () => {
    if (isReposted) return; // prevent double-repost
    try {
      await postService.repostPost(post.id);
      setIsReposted(true);
      onUpdate(post.id, { shares: post.shares + 1 });
    } catch (error) {
      console.error('Failed to repost:', error);
    }
  };

  const handleSend = () => {
    setShowSendModal(true);
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/#/posts/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers that block clipboard
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setSendToast('sent');
    setShowSendModal(false);
    setTimeout(() => setSendToast('idle'), 3000);
  };

  const handleAddComment = async (content: string) => {
    const newComment = await postService.addComment(post.id, content);
    setComments([...comments, newComment]);
    onUpdate(post.id, { comments: post.comments + 1 });
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 18,
        padding: '1.375rem 1.5rem',
        marginBottom: '0.875rem',
        border: '1px solid #E8EDF2',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.03)',
        transition: 'box-shadow 200ms ease',
        overflow: 'visible',
        position: 'relative',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.03)')}
    >
      <PostHeader author={post.author} timestamp={post.timestamp} />
      <PostContent content={post.content} />
      <PostActions
        likes={post.likes}
        comments={post.comments}
        shares={post.shares}
        isLiked={post.isLiked}
        isReposted={isReposted}
        onLike={handleLike}
        onComment={handleComment}
        onRepost={handleRepost}
        onSend={handleSend}
      />

      {isCommentSectionOpen && (
        <CommentSection
          postId={post.id}
          comments={comments}
          isLoading={isLoadingComments}
          onAddComment={handleAddComment}
        />
      )}

      {/* ── Send modal ── */}
      {showSendModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowSendModal(false)}
        >
          <div
            style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem' }}>
              Send post
            </h3>
            <button
              onClick={handleCopyLink}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem', background: 'rgba(29,78,216,0.15)', border: '1px solid rgba(29,78,216,0.3)', borderRadius: 10, color: '#60A5FA', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
            >
              🔗 Copy link to post
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Check out this post: ${window.location.origin}/#/posts/${post.id}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
                setShowSendModal(false);
              }}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 10, color: '#4ADE80', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
            >
              💬 Share via WhatsApp
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Check out this post on Graduate Connect: ${window.location.origin}/#/posts/${post.id}`);
                window.open(`mailto:?subject=Post from Graduate Connect&body=${text}`, '_blank');
                setShowSendModal(false);
              }}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 10, color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
            >
              ✉️ Send via Email
            </button>
            <button
              onClick={() => setShowSendModal(false)}
              style={{ width: '100%', padding: '0.6rem', background: 'transparent', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 10, color: '#94A3B8', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Copy-link toast ── */}
      {sendToast === 'sent' && (
        <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', background: '#1E293B', border: '1px solid rgba(96,165,250,0.3)', color: '#60A5FA', padding: '0.6rem 1.25rem', borderRadius: 99, fontSize: '0.85rem', fontWeight: 600, zIndex: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          ✓ Link copied to clipboard
        </div>
      )}
    </div>
  );
};
