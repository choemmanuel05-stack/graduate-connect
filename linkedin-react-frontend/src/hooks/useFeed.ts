import { useState, useEffect, useCallback } from 'react';
import { postService } from '../services/postService';
import { Post } from '../types/post';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { id: '1', name: 'Emmanuel Cho Tepi', role: 'Administrator' },
    content: 'Welcome to Graduate Connect! Connect with graduates and employers.',
    timestamp: new Date().toISOString(),
    likes: 5,
    comments: 2,
    shares: 0,
    isLiked: false,
  },
  {
    id: '2',
    author: { id: '2', name: 'Jane Smith', role: 'Graduate' },
    content: 'Excited to start my new role as a Software Engineer! #GraduateConnect',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 12,
    comments: 4,
    shares: 1,
    isLiked: false,
  },
];

export const useFeed = () => {
  // Start with mock posts immediately — no loading flash
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const loadPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    setIsLoading(true);

    try {
      const response = await postService.getFeed(pageNum, 10);
      // Only replace mock posts if we got real data back
      if (response.data && response.data.length > 0) {
        setPosts(prev => append ? [...prev, ...response.data] : response.data);
        setHasMore(response.hasMore);
        setPage(pageNum);
      }
    } catch {
      // Keep showing mock posts on error — no flash of empty state
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadPosts(page + 1, true);
    }
  }, [isLoading, hasMore, page, loadPosts]);

  const addPost = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, ...updates } : post));
  }, []);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  return { posts, isLoading, hasMore, error: null, loadMore, addPost, updatePost, refresh: () => loadPosts(1) };
};
