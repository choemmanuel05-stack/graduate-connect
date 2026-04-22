import api from './api';
import type { User } from '../types/user';

/**
 * User update data interface
 */
interface UserUpdateData {
  fullName?: string;
  avatar?: string;
  specialization?: string;
  university?: string;
  companyName?: string;
  industry?: string;
}

/**
 * User service for managing user profiles and connections
 */
export const userService = {
  /**
   * Get user profile by ID
   * @param userId - ID of the user
   */
  getUser: async (userId: string): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   * @param userId - ID of the user
   * @param updates - Partial user data to update
   */
  updateUser: async (userId: string, updates: UserUpdateData): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, updates);
    return response.data;
  },

  /**
   * Get suggested connections for the current user
   */
  getSuggestedConnections: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users/suggested');
    return response.data;
  },
};
