import api from './api';

/**
 * Search result type
 */
export type SearchType = 'user' | 'post' | 'topic' | 'all';

/**
 * Search result interface
 */
export interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'topic';
  title: string;
  subtitle?: string;
  avatar?: string;
}

/**
 * Search service for searching users, posts, and topics
 */
export const searchService = {
  /**
   * Search for users, posts, or topics
   * @param query - Search query string
   * @param type - Type of content to search (user, post, topic, or all)
   */
  search: (query: string, type: SearchType = 'all'): Promise<SearchResult[]> => {
    return api.get<SearchResult[]>(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  },
};
