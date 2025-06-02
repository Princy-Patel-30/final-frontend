import { useDispatch, useSelector } from 'react-redux';
import {
  registerUser,
  loginUser,
  clearError,
  clearSuccessMessage,
} from '../Redux/Slices/Auth.Slice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, successMessage } = useSelector(
    (state) => state.auth,
  );

  const register = (userData) => dispatch(registerUser(userData));
  const login = (credentials) => dispatch(loginUser(credentials));
  const clearAuthError = () => dispatch(clearError());
  const clearAuthSuccess = () => dispatch(clearSuccessMessage());

  return {
    user,
    isAuthenticated,
    loading,
    error,
    successMessage,
    register,
    login,
    clearAuthError,
    clearAuthSuccess,
  };
};
