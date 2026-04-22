import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  initials,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-20 h-20 text-2xl',
  };

  const baseClasses = `rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseClasses} object-cover`}
      />
    );
  }

  if (initials) {
    return (
      <div className={baseClasses}>
        {initials.toUpperCase()}
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <User className="w-1/2 h-1/2" />
    </div>
  );
};
