import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './Routes/ProtectedRoute';
// import Landing from './Pages/Landing';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Activate from './Pages/Activate';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import Feed from './Pages/Feed';
import Profile from './Pages/Profile';
import Loader from '../Utils/Loader';
import './App.css';
import useInitAuth from '../Hooks/useinitAuth';
import MainLayout from './Layout/MainLayout';
import Search from './Components/Search';

function App() {
  const { loading } = useInitAuth();

  if (loading) return <Loader size="large" />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activate/:token" element={<Activate />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Feed />} />
          <Route path="profile/:username" element={<Profile />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
