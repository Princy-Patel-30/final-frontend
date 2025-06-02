import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Form from '../Components/Form';
import { formTypes } from '../../Config/FormConfig';
import AuthCard from '../Components/AuthCard';
import { resetPassword } from '../../Services/Auth.Service';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await resetPassword({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setSuccessMessage(response.message || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (error) toast.error(error);
  }, [successMessage, error]);

  return (
    <>
      <AuthCard title="Reset Password" subtitle="Set your new password">
        <Form formType={formTypes.RESET_PASSWORD} onSubmit={handleSubmit} />
        {loading && <p>Loading...</p>}
      </AuthCard>
    </>
  );
};

export default ResetPassword;
