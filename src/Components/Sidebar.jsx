import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../Redux/Slices/Auth.Slice';
import IconRenderer from './IconRenderer';

const sidebarItems = [
  { type: 'home', text: 'Home' },
  { type: 'search', text: 'Search' },
  { type: 'plus', text: 'Create post' },
  { type: 'bookmark', text: 'Saved posts' },
  { type: 'chat', text: 'Messages' },
  { type: 'profile', text: 'Profile' },
];

const Sidebar = () => {
  const [activeIcon, setActiveIcon] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleClick = async (type) => {
    setActiveIcon(type);
    if (mobileOpen) setMobileOpen(false);

    if (type === 'profile') {
      let userId = user?.id;
      if (!userId) {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          userId = storedUser?.id;
        } catch (error) {
          console.error('Failed to get userId from localStorage:', error);
        }
      }
      if (userId) {
        navigate(`/profile/${userId}`);
      } else {
        console.error('No userId available for profile navigation');
        navigate('/login');
      }
      return;
    }

    switch (type) {
      case 'home':
        navigate('/');
        break;
      case 'search':
        navigate('/search');
        break;
      case 'bookmark':
        navigate('/saved');
        break;
      case 'plus':
        navigate('/create-post');
        break;
      case 'chat':
        navigate('/messages');
        break;
      case 'logout':
        await dispatch(logoutUser());
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around bg-gray-100 shadow-xl md:hidden">
        {sidebarItems.map(({ type }) => (
          <button
            key={type}
            onClick={() => handleClick(type)}
            className={`p-2 ${activeIcon === type ? 'bg-pink-200' : ''} rounded-full`}
          >
            <IconRenderer
              type={type}
              size="24"
              isRaw={true}
              className={`text-gray-800 ${activeIcon === type ? 'text-pink-600' : ''}`}
            />
          </button>
        ))}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`p-2 ${activeIcon === 'menu' ? 'bg-pink-200' : ''} rounded-full`}
        >
          <IconRenderer
            type="menu"
            size="24"
            isRaw={true}
            className={`text-gray-800 ${activeIcon === 'menu' ? 'text-gray-600' : ''}`}
          />
        </button>
      </div>

      {/* Full Sidebar (Mobile Toggle or Desktop) */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-gray-100 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:block md:h-full md:w-full md:translate-x-0 md:rounded-r-2xl`}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col items-start gap-2">
            {sidebarItems.map(({ type, text }) => (
              <IconRenderer
                key={type}
                type={type}
                text={text}
                size="28"
                onClick={() => handleClick(type)}
                isActive={activeIcon === type}
                className="text-xl"
              />
            ))}
          </div>
          <IconRenderer
            type="logout"
            text="Sign Out"
            size="28"
            onClick={() => handleClick('logout')}
            isActive={activeIcon === 'logout'}
            className="text-xl"
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
