import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken } from '../Redux/Slices/Auth.Slice';

const useInitAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, authChecked } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    console.log('Authenticated', isAuthenticated);
    console.log('Initially login', authChecked);
    if (!authChecked && !isAuthenticated) {
      dispatch(refreshAccessToken());
    }
  }, [dispatch, authChecked, isAuthenticated]);

  const isLoading = loading || !authChecked;

  return { isAuthenticated, loading: isLoading, authChecked };
};

export default useInitAuth;
