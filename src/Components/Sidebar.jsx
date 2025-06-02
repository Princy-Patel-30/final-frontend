import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../Redux/Slices/Auth.Slice';
import IconRenderer from './IconRenderer';

const Sidebar = () => {
  const [activeIcon, setActiveIcon] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleIconClick = (type, callback) => {
    setActiveIcon(type);
    if (callback) callback();
  };

  const handleLogout = async () => {
    setActiveIcon('logout');
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="flex w-full max-w-xs flex-col items-start justify-between overflow-y-auto border-r bg-white px-4 pt-8 pb-4">
      <div className="flex w-full flex-col items-start gap-6">
        <IconRenderer
          type="profile"
          text="Profile"
          size="32"
          onClick={() => handleIconClick('profile')}
          isActive={activeIcon === 'profile'}
          className="text-2xl"
        />
        <IconRenderer
          type="home"
          text="Home"
          size="32"
          onClick={() => handleIconClick('home')}
          isActive={activeIcon === 'home'}
          className="text-2xl"
        />
        <IconRenderer
          type="search"
          text="Search"
          size="32"
          onClick={() => handleIconClick('search')}
          isActive={activeIcon === 'search'}
          className="text-2xl"
        />
        <IconRenderer
          type="bookmark"
          text="Saved posts"
          size="32"
          onClick={() => handleIconClick('bookmark')}
          isActive={activeIcon === 'bookmark'}
          className="text-2xl"
        />
        <IconRenderer
          type="plus"
          text="create post"
          size="32"
          onClick={() => handleIconClick('plus')}
          isActive={activeIcon === 'plus'}
          className="text-2xl"
        />
        <IconRenderer
          type="chat"
          text="Messages"
          size="32"
          onClick={() => handleIconClick('chat')}
          isActive={activeIcon === 'chat'}
          className="text-2xl"
        />
        <IconRenderer
          type="settings"
          text="Settings"
          size="32"
          onClick={() => handleIconClick('settings')}
          isActive={activeIcon === 'settings'}
          className="text-2xl"
        />
        <IconRenderer
          type="logout"
          text="Sign Out"
          size="32"
          onClick={handleLogout}
          isActive={activeIcon === 'logout'}
          className="text-2xl"
        />
      </div>
      <IconRenderer
        type="menu"
        text="Menu"
        size="28"
        onClick={() => handleIconClick('menu')}
        isActive={activeIcon === 'menu'}
        className="self-center text-xl"
      />
    </div>
  );
};

export default Sidebar;
