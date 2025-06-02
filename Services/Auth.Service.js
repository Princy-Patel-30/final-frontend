import api from '../Utils/Api';

export const register = async ({ name, email, password, confirmPassword }) => {
  try {
    console.log('Sending to backend:', {
      name,
      email,
      password,
      confirmPassword,
    });
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const login = async ({ loginId, password }) => {
  try {
    const response = await api.post(
      '/auth/login',
      { loginId, password },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const activateAccount = async (token) => {
  try {
    const response = await api.get(`/auth/activate/${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Account activation failed');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send reset link');
  }
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Password reset failed');
  }
};

export const logout = async () => {
  try {
    const response = await api.post(
      '/auth/logout',
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Logout failed');
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post(
      '/auth/refresh-token',
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to refresh access token',
    );
  }
};
