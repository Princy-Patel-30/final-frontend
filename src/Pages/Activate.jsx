import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  activateUserAccount,
  clearError,
  clearSuccessMessage,
} from '../../Redux/Slices/Auth.Slice';
import { toast } from 'react-toastify';

const Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(activateUserAccount(token));
  }, [token, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        autoClose: 3000,
      });
      dispatch(clearSuccessMessage());
      navigate('/login');
    }
    if (error) {
      toast.error(error, {
        autoClose: 3000,
      });
      dispatch(clearError());
      navigate('/register');
    }
  }, [successMessage, error, dispatch, navigate]);

  return <p className="mt-10 text-center">Activating your account...</p>;
};

export default Activate;
