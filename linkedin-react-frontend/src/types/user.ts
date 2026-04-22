/**
 * User interface representing a user in the Graduate Connect platform
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Graduate' | 'Employer' | 'Administrator';
  avatar?: string;
  
  // Graduate-specific fields
  specialization?: string;
  university?: string;
  
  // Employer-specific fields
  companyName?: string;
  industry?: string;
}
