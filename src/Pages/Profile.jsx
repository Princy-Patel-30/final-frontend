import PostGrid from '../Components/PostGrid';
import ProfileDetails from '../Components/ProfileDetails';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <ProfileDetails />
        <PostGrid />
      </div>
    </div>
  );
};

export default Profile;
