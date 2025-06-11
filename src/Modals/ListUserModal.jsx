import { useState, useEffect, memo } from 'react';
import Loader from '../../Utils/Loader.jsx';
import {
  useFollowers,
  useFollowing,
  useUnfollow,
} from '../../Hooks/useProfile.js';
import { useSelector } from 'react-redux';
import Button from '../Components/Button';
import { ButtonTypes } from '../../Config/ButtonConfig';
import IconRenderer from '../Components/IconRenderer';
import AvatarView from '../Components/AvatarView.jsx';

const ListUserModal = ({ isOpen, onClose, type, userId }) => {
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = type === 'followers' ? useFollowers(userId) : useFollowing(userId);

  // Effect to refetch data when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      refetch();
    }
  }, [isOpen, type, userId, refetch]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'followers':
        return 'Followers';
      case 'following':
        return 'Following';
      default:
        return 'Users';
    }
  };

  let users = [];
  let total = 0;
  if (data) {
    if (type === 'following') {
      users = data.following || [];
      total = data.totalFollowing || 0;
    } else if (type === 'followers') {
      users = data.followers || [];
      total = data.totalFollowers || 0;
    }
  }

  const normalizedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    displayName: user.displayName || user.name,
    avatarUrl: user.avatarUrl || null,
    bio: user.bio || '',
  }));

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-5">
          <h2 className="text-xl font-bold text-gray-900">
            {getTitle()}
            {total > 0 && (
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-500">
                {total}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-gray-200"
            aria-label="Close modal"
          >
            <IconRenderer type="close" size={23} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader />
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <div className="mb-4">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <IconRenderer
                    type="close"
                    size={24}
                    className="text-red-500"
                  />
                </div>
                <p className="mb-1 font-medium text-red-600">
                  Something went wrong
                </p>
                <p className="text-sm text-gray-500">
                  {queryError?.message || 'Failed to load data'}
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : normalizedUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <IconRenderer type="user" size={24} className="text-gray-400" />
              </div>
              <p className="mb-1 font-medium text-gray-500">
                No {getTitle().toLowerCase()} yet
              </p>
              <p className="text-sm text-gray-400">
                {type === 'followers'
                  ? 'When people follow this account, they will appear here.'
                  : 'When this account follows people, they will appear here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {normalizedUsers.map((user, index) => (
                <UserItem
                  key={user.id}
                  user={user}
                  type={type}
                  refetch={refetch}
                  isLast={index === normalizedUsers.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserItem = memo(({ user, type, refetch, isLast }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const unfollowMutation = useUnfollow(currentUser?.id);

  const handleUnfollow = (e) => {
    e.stopPropagation();
    unfollowMutation.mutate(user.id, {
      onSuccess: () => refetch(),
    });
  };

  const handleUserClick = () => {
    console.log('Navigate to user:', user.name);
    // Add navigation logic here
  };

  return (
    <div
      className={`flex cursor-pointer items-center justify-between gap-4 p-4 transition-all duration-200 hover:bg-gray-50 ${isLast ? '' : 'border-b border-gray-50'}`}
      onClick={handleUserClick}
    >
      {/* Avatar + Info */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="shrink-0">
          <AvatarView
            src={user.avatarUrl}
            size="md"
            className="ring-2 ring-gray-100 transition-all duration-200 hover:ring-gray-200"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {user.displayName}
            </h3>
          </div>
          <p className="mb-1 truncate text-sm text-gray-500">@{user.name}</p>
          {user.bio && (
            <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      {type === 'following' && currentUser?.id !== user.id && (
        <div className="shrink-0">
          <Button
            type={ButtonTypes.UNFOLLOW}
            text={unfollowMutation.isPending ? '...' : 'Unfollow'}
            onClick={handleUnfollow}
            disabled={unfollowMutation.isPending}
            sx={{
              minWidth: '80px',
              height: '36px',
              fontSize: '0.875rem',
              fontWeight: '500',
              padding: '0 16px',
              whiteSpace: 'nowrap',
              opacity: unfollowMutation.isPending ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          />
        </div>
      )}
    </div>
  );
});

UserItem.displayName = 'UserItem';

export default memo(ListUserModal);
