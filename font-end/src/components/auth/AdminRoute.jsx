import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default AdminRoute; 