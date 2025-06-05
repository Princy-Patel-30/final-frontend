import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUserProfile, useUpdateProfile } from '../../Hooks/useProfile.js';
import Loader from '../../Utils/Loader.jsx';
import AvatarView from './Avatarview.jsx';
import Button from './Button.jsx';
import EditProfileModal from '../Modals/EditProfileModal';

const ProfileDetails = ({ username: propUsername }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username: paramUsername } = useParams();
  const user = useSelector((state) => state.auth.user);

  const updateProfileMutation = useUpdateProfile();

  let username = propUsername || paramUsername;
  if (!username && user?.name) {
    username = user.name;
  }

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserProfile(username, {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const isOwnProfile =
    user &&
    (user.name === username ||
      user.name === profile?.name ||
      (!username && profile?.name === user.name));

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileSave = async (formData) => {
    console.log('ProfileDetails - Profile save completed:', formData);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.error('Profile fetch error:', error);
    if (error.response?.status === 404) {
      return (
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-center text-gray-600">
            User {username} not found.
          </p>
        </div>
      );
    }
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-center text-gray-600">
          Couldnot load profile. Please try again later.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-center text-gray-600">Profile data not available.</p>
      </div>
    );
  }

  const {
    avatarUrl,
    bio,
    _count: { posts, followers, following } = {
      posts: 0,
      followers: 0,
      following: 0,
    },
    name: displayName = username,
  } = profile;

  return (
    <>
      <div className="relative flex flex-col items-start gap-4 rounded-lg bg-white p-6 shadow">
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button
              type="editProfile"
              text="Edit Profile"
              onClick={handleEditProfile}
              disabled={updateProfileMutation.isPending}
              sx={{
                minWidth: 'auto',
                padding: '8px 16px',
                fontSize: '0.875rem',
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <AvatarView src={avatarUrl} size="lg" />
          <div>
            <h1 className="text-2xl leading-tight font-bold break-words">
              {displayName}
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
            <CountWithButton
              count={posts}
              type="posts"
              onClick={() => console.log('Posts clicked')}
            />
            <CountWithButton
              count={followers}
              type="followers"
              onClick={() => console.log('Followers clicked')}
            />
            <CountWithButton
              count={following}
              type="following"
              onClick={() => console.log('Following clicked')}
            />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleProfileSave}
        currentProfile={profile}
        username={username}
      />
    </>
  );
};

// Reusable subcomponent for stat count + button
const CountWithButton = ({ count, type, onClick }) => (
  <div className="flex flex-col items-center">
    <div className="text-lg font-semibold">{count ?? 0}</div>
    <Button
      type={type}
      text={capitalize(type)}
      onClick={onClick}
      sx={{ padding: '4px 12px', fontSize: '0.8rem', minWidth: '100px' }}
    />
  </div>
);

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default ProfileDetails;
