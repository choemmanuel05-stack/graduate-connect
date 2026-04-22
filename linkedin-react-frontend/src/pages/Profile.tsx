import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/common/Avatar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { userService } from '../services/userService';
import { User } from '../types/user';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      try {
        const userData = await userService.getUser(userId);
        setUser(userData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return <ErrorMessage message={error || 'User not found'} />;
  }

  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex flex-col items-center text-center">
        <Avatar
          src={user.avatar}
          initials={initials}
          size="lg"
          className="mb-4"
        />
        
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-2">
          {user.fullName}
        </h1>
        
        <p className="text-lg text-[#6B7280] mb-4">
          {user.role}
        </p>

        {user.role === 'Graduate' && (
          <div className="space-y-2">
            {user.specialization && (
              <p className="text-[#1C1C1C]">
                <span className="font-medium">Specialization:</span> {user.specialization}
              </p>
            )}
            {user.university && (
              <p className="text-[#1C1C1C]">
                <span className="font-medium">University:</span> {user.university}
              </p>
            )}
          </div>
        )}

        {user.role === 'Employer' && (
          <div className="space-y-2">
            {user.companyName && (
              <p className="text-[#1C1C1C]">
                <span className="font-medium">Company:</span> {user.companyName}
              </p>
            )}
            {user.industry && (
              <p className="text-[#1C1C1C]">
                <span className="font-medium">Industry:</span> {user.industry}
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-[#6B7280] mt-4">
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
