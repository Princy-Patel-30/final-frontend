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
  } = useAuth();
  const navigate = useNavigate();

  // Handle redirects and notifications
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
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
    successMessage,
    error,
    clearAuthSuccess,
    clearAuthError,
    navigate,
  ]);

  // Handle login submission
  const handleSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <>
      <AuthCard title="Login" subtitle="Login to continue">
        <Form formType={formTypes.LOGIN} onSubmit={handleSubmit} />
        {/* {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>} */}
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

      {/* Toast container */}
    </>
  );
};

export default Login;
