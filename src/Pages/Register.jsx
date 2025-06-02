import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formTypes } from '../../Config/FormConfig';
import Form from '../Components/Form';
import AuthCard from '../Components/AuthCard';
import { useAuth } from '../../Hooks/useAuth';
import { toast } from 'react-toastify';

const Register = () => {
  const {
    register,
    loading,
    error,
    successMessage,
    clearAuthError,
    clearAuthSuccess,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearAuthSuccess();
      navigate('/login');
    }
    if (error) {
      toast.error(error);
      clearAuthError();
    }
  }, [successMessage, error]);

  const handleSubmit = async (data) => {
    const result = await register(data);
    if (result?.token) {
      navigate(`/activate/${result.token}`);
    }
  };

  return (
    <AuthCard title="Register" subtitle="Create your account">
      <Form formType={formTypes.REGISTER} onSubmit={handleSubmit} />
      {loading && <p>Loading...</p>}
      <p className="mt-4">
        Already registered?{' '}
        <span
          onClick={() => navigate('/login')}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          Login here
        </span>
      </p>
    </AuthCard>
  );
};

export default Register;
