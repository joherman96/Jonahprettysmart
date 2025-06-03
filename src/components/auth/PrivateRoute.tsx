import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // For demo purposes, we're also checking localStorage
  const hasToken = !!localStorage.getItem('auth_token');
  
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/auth/signin" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;