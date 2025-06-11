import axios from 'axios';
import { refreshToken } from '../Services/Auth.Service';
import store from '../Redux/Store';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
let firstAuthCheck = true;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === 'Invalid or expired access token' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      store.dispatch({ type: 'auth/refreshAccessToken/pending' });
      try {
        const refreshResponse = await refreshToken();
        store.dispatch({
          type: 'auth/refreshAccessToken/fulfilled',
          payload: { message: refreshResponse.message },
        });
        toast.success(
          refreshResponse.message || 'Access token refreshed successfully',
        );
        return api(originalRequest);
      } catch (refreshError) {
        if (!firstAuthCheck) {
          toast.error(refreshError.response?.data?.error || 'Session expired');
        }
        store.dispatch({
          type: 'auth/refreshAccessToken/rejected',
          payload: refreshError.message,
        });
        firstAuthCheck = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
