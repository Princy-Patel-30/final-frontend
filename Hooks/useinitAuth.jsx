import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken, setAuthChecked } from '../Redux/Slices/Auth.Slice';

const useInitAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, authChecked, user } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (user && !authChecked) {
      dispatch(refreshAccessToken());
    } else if (!user && !authChecked && !isAuthenticated) {
      dispatch(refreshAccessToken());
    } else if (!user && !isAuthenticated && !loading) {
      dispatch(setAuthChecked());
    }
  }, [dispatch, authChecked, isAuthenticated, user, loading]);

  const isLoading = loading || !authChecked;

  return { isAuthenticated, loading: isLoading, authChecked };
};

export default useInitAuth;
