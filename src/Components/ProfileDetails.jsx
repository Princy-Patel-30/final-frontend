import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useUserProfile,
  useUpdateProfile,
  useFollow,
  useUnfollow,
} from '../../Hooks/useProfile.js';
import Loader from '../../Utils/Loader.jsx';
import AvatarView from './Avatarview.jsx';
import Button from './Button.jsx';
import { ButtonTypes } from '../../Config/ButtonConfig';
import EditProfileModal from '../Modals/EditProfileModal';
import ListUserModal from '../Modals/ListUserModal.jsx';

const ProfileDetails = ({ userId: propUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  const [userListModalType, setUserListModalType] = useState('');
  const [hoveredFollowButton, setHoveredFollowButton] = useState(false);

  const { id: paramUserId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const updateProfileMutation = useUpdateProfile();
  const followMutation = useFollow(user?.id);
  const unfollowMutation = useUnfollow(user?.id);

  const userId = paramUserId || propUserId || user?.id;

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserProfile(
    userId,
    {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000, // Reduced stale time
    },
    user?.id,
  );

  const profile = responseData?.data;
  const isOwnProfile = user && (user.id === userId || user.id === profile?.id);

  const handleEditProfile = () => setIsModalOpen(true);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleProfileSave = async (formData) => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsModalOpen(false);
      // No need to manually refetch - the mutation will invalidate queries
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleFollow = () => {
    followMutation.mutate(profile.id);
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate(profile.id);
  };

  const handleStatClick = (type) => {
    if (type === 'posts') {
      return; // Posts don't open modal
    }
    setUserListModalType(type);
    setIsUserListModalOpen(true);
  };

  const handleCloseUserListModal = () => {
    setIsUserListModalOpen(false);
    setUserListModalType('');
  };

  if (isLoading) return <Loader />;

  if (isError || !profile) {
    const message =
      error?.response?.status === 404
        ? 'User not found.'
        : 'Could not load profile. Please try again later.';

    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-center text-gray-600">{message}</p>
        {error?.response?.status !== 404 && (
          <button
            onClick={() => refetch()}
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const {
    avatarUrl,
    name,
    bio,
    _count: { posts = 0, following = 0, followers = 0 } = {},
    isFollowing,
  } = profile;

  const isFollowActionPending =
    followMutation.isPending || unfollowMutation.isPending;

  const renderFollowButton = () => {
    if (!user || isOwnProfile) return null;

    if (isFollowing) {
      return (
        <div className="flex gap-2">
          <Button
            type={ButtonTypes.FOLLOWING}
            text="Following"
            disabled={true}
            fullWidth={false}
            sx={{
              minWidth: '100px',
              padding: '8px 16px',
              fontSize: '0.875rem',
              opacity: 0.7,
              cursor: 'default',
            }}
          />
          <Button
            type={ButtonTypes.UNFOLLOW}
            text={unfollowMutation.isPending ? 'Unfollowing...' : 'Unfollow'}
            onClick={handleUnfollow}
            disabled={isFollowActionPending}
            fullWidth={false}
            onMouseEnter={() => setHoveredFollowButton(true)}
            onMouseLeave={() => setHoveredFollowButton(false)}
            sx={{
              minWidth: '100px',
              padding: '8px 16px',
              fontSize: '0.875rem',
              opacity: isFollowActionPending ? 0.6 : 1,
            }}
          />
        </div>
      );
    } else {
      return (
        <Button
          type={ButtonTypes.FOLLOW}
          text={followMutation.isPending ? 'Following...' : 'Follow'}
          onClick={handleFollow}
          disabled={isFollowActionPending}
          fullWidth={false}
          sx={{
            minWidth: '100px',
            padding: '8px 16px',
            fontSize: '0.875rem',
            opacity: isFollowActionPending ? 0.6 : 1,
          }}
        />
      );
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-start gap-4 rounded-lg bg-white p-6 shadow">
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwnProfile ? (
            <Button
              type={ButtonTypes.EDIT_PROFILE}
              text="Edit Profile"
              onClick={handleEditProfile}
              disabled={updateProfileMutation.isPending}
              fullWidth={false}
              sx={{
                minWidth: 'auto',
                padding: '8px 16px',
                fontSize: '0.875rem',
              }}
            />
          ) : (
            renderFollowButton()
          )}
        </div>

        <div className="flex items-center gap-4">
          <AvatarView src={avatarUrl} size="lg" />
          <div>
            <h1 className="text-2xl leading-tight font-bold break-words">
              {name}
            </h1>
            {bio && (
              <p className="mt-1 max-w-xs text-sm break-words text-gray-500">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 w-full">
          <div className="flex justify-center gap-12">
            <StatItem
              count={posts}
              label="Posts"
              onClick={() => handleStatClick('posts')}
              clickable={false}
            />
            <StatItem
              count={following}
              label="Followers"
              onClick={() => handleStatClick('followers')}
              clickable={true}
            />
            <StatItem
              count={followers}
              label="Following"
              onClick={() => handleStatClick('following')}
              clickable={true}
            />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleProfileSave}
        currentProfile={profile}
        userId={userId}
      />

      <ListUserModal
        isOpen={isUserListModalOpen}
        onClose={handleCloseUserListModal}
        type={userListModalType}
        userId={userId}
      />
    </>
  );
};

const StatItem = ({ count, label, onClick, clickable = true }) => (
  <div
    className={`group flex flex-col items-center transition-all duration-200 ${
      clickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'
    }`}
    onClick={clickable ? onClick : undefined}
  >
    <div
      className={`text-lg font-semibold transition-colors ${
        clickable && label === 'Followers'
          ? 'group-hover:text-pink-500'
          : clickable && label === 'Following'
            ? 'group-hover:text-pink-500'
            : 'text-gray-900'
      }`}
    >
      {count ?? 0}
    </div>
    <div
      className={`rounded-md px-3 py-1 text-sm text-gray-600 transition-colors ${
        clickable && label === 'Followers'
          ? 'group-hover:bg-pink-50 group-hover:text-pink-500'
          : clickable && label === 'Following'
            ? 'group-hover:bg-pink-50 group-hover:text-pink-500'
            : ''
      }`}
    >
      {label}
    </div>
  </div>
);

export default ProfileDetails;
