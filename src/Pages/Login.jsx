import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formTypes } from '../../Config/FormConfig';
import Form from '../Components/Form';
import AuthCard from '../Components/AuthCard';
import { useAuth } from '../../Hooks/useAuth';

const Login = () => {
  const {
    login,
    error,
    successMessage,
    clearAuthError,
    clearAuthSuccess,
    isAuthenticated,
    loading,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only navigate if authenticated and not loading
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }

    if (successMessage) {
      toast.success(successMessage);
      clearAuthSuccess();
    }

    if (error) {
      toast.error(error);
      clearAuthError();
    }
  }, [
    isAuthenticated,
    loading,
    successMessage,
    error,
    clearAuthSuccess,
    clearAuthError,
    navigate,
  ]);

  const handleSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Don't render the login form if user is already authenticated
  if (isAuthenticated && !loading) {
    return null;
  }

  return (
    <>
      <AuthCard title="Login" subtitle="Login to continue">
        <Form formType={formTypes.LOGIN} onSubmit={handleSubmit} />
        {loading && <p className="mt-2 text-sm text-gray-500">Logging in...</p>}
        <p className="mt-4">
          New user?{' '}
          <span
            onClick={() => navigate('/register')}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            Register here
          </span>
        </p>
        <p className="mt-2">
          Forgot your password?{' '}
          <span
            onClick={() => navigate('/forgot-password')}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            Reset it here
          </span>
        </p>
      </AuthCard>
    </>
  );
};

export default Login;
