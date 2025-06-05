import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../Redux/Slices/Auth.Slice';
import IconRenderer from './IconRenderer';

const sidebarItems = [
  { type: 'profile', text: 'Profile' },
  { type: 'home', text: 'Home' },
  { type: 'search', text: 'Search' },
  { type: 'bookmark', text: 'Saved posts' },
  { type: 'plus', text: 'Create post' },
  { type: 'chat', text: 'Messages' },
  { type: 'settings', text: 'Settings' },
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

    // Handle profile navigation username logic outside switch
    if (type === 'profile') {
      let username = user?.name;
      if (!username) {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          username = storedUser?.name;
        } catch (error) {
          console.error('Failed to get user from localStorage:', error);
        }
      }
      if (username) {
        navigate(`/profile/${username}`);
      } else {
        console.error('No username available for profile navigation');
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
      case 'settings':
        navigate('/settings');
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
      {/* Mobile toggle button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-800 focus:outline-none"
        >
          <IconRenderer type="menu" size="28" />
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 transform border-r bg-white transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:block md:translate-x-0`}
      >
        <div className="flex h-full flex-col justify-between px-4 pt-8 pb-4">
          <div className="flex flex-col items-start gap-6">
            {sidebarItems.map(({ type, text }) => (
              <IconRenderer
                key={type}
                type={type}
                text={text}
                size="32"
                onClick={() => handleClick(type)}
                isActive={activeIcon === type}
                className="text-2xl"
              />
            ))}
            <IconRenderer
              type="logout"
              text="Sign Out"
              size="32"
              onClick={() => handleClick('logout')}
              isActive={activeIcon === 'logout'}
              className="text-2xl"
            />
          </div>

          <IconRenderer
            type="menu"
            text="Menu"
            size="28"
            onClick={() => handleClick('menu')}
            isActive={activeIcon === 'menu'}
            className="self-center text-xl"
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
