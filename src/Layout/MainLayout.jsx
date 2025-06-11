import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 md:flex-row">
      {/* Sidebar: Full height on desktop, bottom on mobile */}
      <div className="z-50 bg-pink-100 shadow-xl md:sticky md:top-0 md:h-screen md:w-75 md:rounded-r-3xl">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="h-screen flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
