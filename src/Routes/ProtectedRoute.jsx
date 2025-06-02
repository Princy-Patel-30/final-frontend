import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, authChecked } = useSelector(
    (state) => state.auth,
  );

  console.log('authenticated from protected route', isAuthenticated);
  console.log('authcheck flag', authChecked);

  // Wait for auth check to complete before deciding
  if (loading || !authChecked) return null;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
