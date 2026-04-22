/**
 * Post interface representing a post in the feed
 */
export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  timestamp: string; // ISO 8601 format
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean; // Current user's like status
}

/**
 * Comment interface representing a comment on a post
 */
export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string; // ISO 8601 format
}
