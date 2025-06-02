import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Form from '../Components/Form';
import { formTypes } from '../../Config/FormConfig';
import AuthCard from '../Components/AuthCard';
import { forgotPassword } from '../../Services/Auth.Service';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await forgotPassword(data.email);
      setSuccessMessage(response.message || 'Reset link sent successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
    if (error) {
      toast.error(error);
    }
  }, [successMessage, error]);

  return (
    <>
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your email to receive a reset link"
      >
        <Form formType={formTypes.FORGOT_PASSWORD} onSubmit={handleSubmit} />
        {loading && <p>Loading...</p>}
        <p className="mt-4">
          Remembered your password?{' '}
          <span
            onClick={() => navigate('/login')}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            Login here
          </span>
        </p>
      </AuthCard>
    </>
  );
};

export default ForgotPassword;
