import React from 'react';
import { CreatePostBox } from './CreatePostBox';
import { PostCard } from './PostCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useFeed } from '../../hooks/useFeed';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

export const Feed: React.FC = () => {
  const { posts, isLoading, hasMore, error, loadMore, addPost, updatePost } = useFeed();
  
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading,
  });

  return (
    <div className="w-full">
      <CreatePostBox onPostCreated={addPost} />

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={updatePost} />
        ))}
      </div>

      {posts.length === 0 && !isLoading && (
        <div className="text-center py-12 text-[#6B7280]">
          <p>No posts to display</p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-8">
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};
