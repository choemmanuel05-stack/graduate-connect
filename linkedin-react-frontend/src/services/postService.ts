import api from './api';
import { Post } from '../types/post';

interface FeedResponse {
  data: Post[];
  hasMore: boolean;
}

function mapPost(raw: any): Post {
  return {
    id: String(raw.id),
    author: {
      id: String(raw.author?.id || ''),
      name: raw.author?.name || raw.author?.email || 'Unknown',
      role: raw.author?.role || '',
      avatar: raw.author?.avatar,
    },
    content: raw.content || '',
    timestamp: raw.timestamp || raw.created_at || new Date().toISOString(),
    likes: raw.likes ?? 0,
    comments: raw.comments ?? 0,
    shares: raw.shares ?? 0,
    isLiked: raw.isLiked ?? false,
  };
}

export const postService = {
  getFeed: async (page = 1, limit = 10): Promise<FeedResponse> => {
    const res: any = await api.get('/posts/', { params: { page, limit } });
    const posts = (res.results || []).map(mapPost);
    return { data: posts, hasMore: !!res.next };
  },

  createPost: async (content: string): Promise<Post> => {
    const res: any = await api.post('/posts/', { content });
    return mapPost(res);
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}/`);
  },

  likePost: async (postId: string): Promise<{ liked: boolean; likes: number }> => {
    const res: any = await api.post(`/posts/${postId}/like/`);
    return { liked: res.liked, likes: res.likes };
  },

  getComments: async (postId: string): Promise<any[]> => {
    const res: any = await api.get(`/posts/${postId}/comments/`);
    return res.results || [];
  },

  addComment: async (postId: string, content: string): Promise<any> => {
    const res: any = await api.post(`/posts/${postId}/comments/`, { content });
    return res;
  },

  repostPost: async (postId: string): Promise<{ shares: number }> => {
    try {
      const res: any = await api.post(`/posts/${postId}/repost/`);
      return { shares: res.shares ?? 0 };
    } catch {
      // Endpoint may not exist yet — optimistic update only
      return { shares: 0 };
    }
  },

  sendPost: async (postId: string, recipientId?: string): Promise<void> => {
    try {
      await api.post(`/posts/${postId}/send/`, { recipient_id: recipientId });
    } catch {
      // Endpoint may not exist yet — copy link fallback handled in UI
    }
  },
};
