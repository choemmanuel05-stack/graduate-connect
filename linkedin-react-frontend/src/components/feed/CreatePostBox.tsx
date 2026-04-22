import React, { useState } from 'react';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { postService } from '../../services/postService';
import { validatePostContent } from '../../utils/validators';
import { handleApiError } from '../../utils/errorHandler';
import { Post } from '../../types/post';

interface CreatePostBoxProps {
  onPostCreated: (post: Post) => void;
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    const validation = validatePostContent(content);
    if (!validation.valid) {
      setError(validation.message || 'Invalid post content');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost = await postService.createPost(content);
      setContent('');
      onPostCreated(newPost);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 16, padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(148,163,184,0.15)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: '0.9rem', color: '#1E293B', background: '#F8FAFC', resize: 'none', outline: 'none', fontFamily: 'inherit' }}
        rows={3}
        onFocus={e => { e.target.style.borderColor = '#60A5FA'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.15)'; }}
        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
      />
      
      {error && <ErrorMessage message={error} className="mt-3" />}
      
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          isLoading={isSubmitting}
        >
          Post
        </Button>
      </div>
    </div>
  );
};
