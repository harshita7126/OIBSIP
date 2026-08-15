import React, { useState, useEffect } from 'react';
import { formatUserAvatarUrl, getUserInitials } from '../../utils/imageUtils';

export const UserAvatar = ({
  user,
  size = 'md',
  className = '',
  previewUrl = null
}) => {
  const [imgError, setImgError] = useState(false);

  const rawUrl = previewUrl || user?.avatar || user?.profilePhoto;
  const photoUrl = formatUserAvatarUrl(rawUrl);
  const initials = getUserInitials(user?.name);

  useEffect(() => {
    setImgError(false);
  }, [rawUrl]);

  // Size styling maps
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs font-bold rounded-full',
    sm: 'w-9 h-9 text-xs font-extrabold rounded-xl',
    md: 'w-11 h-11 text-sm font-extrabold rounded-2xl',
    lg: 'w-16 h-16 text-xl font-black rounded-2xl',
    xl: 'w-24 h-24 text-3xl font-black rounded-3xl',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={user?.name || 'User Avatar'}
        onError={() => setImgError(true)}
        className={`${currentSizeClass} object-cover border-2 border-orange-200/80 shadow-soft-xs ${className}`}
      />
    );
  }

  return (
    <div
      className={`${currentSizeClass} bg-gradient-to-br from-brand-orange via-amber-500 to-amber-600 text-white flex items-center justify-center border-2 border-orange-200/80 shadow-soft-xs select-none ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
};

export default UserAvatar;
