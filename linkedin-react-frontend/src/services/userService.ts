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
  getUser: (userId: string): Promise<User> => {
    return api.get<User>(`/users/${userId}`);
  },

  /**
   * Update user profile
   * @param userId - ID of the user
   * @param updates - Partial user data to update
   */
  updateUser: (userId: string, updates: UserUpdateData): Promise<User> => {
    return api.put<User>(`/users/${userId}`, updates);
  },

  /**
   * Get suggested connections for the current user
   */
  getSuggestedConnections: (): Promise<User[]> => {
    return api.get<User[]>('/users/suggested');
  },
};
