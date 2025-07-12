import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sử dụng useCallback để tránh tạo lại hàm mỗi khi render
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      console.log('Đang tải thông tin người dùng...');
      const res = await authAPI.getProfile();
      console.log('Thông tin người dùng:', res.data);
      
      // Chỉ cập nhật state một lần
      setUser({ ...res.data.data, token });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      
      // Lỗi 401 được xử lý bởi interceptor, nhưng các lỗi khác cần xử lý ở đây
      if (error.response && error.response.status !== 401) {
        console.log('Lỗi không phải 401:', error.response.status);
        toast.error('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
      }
      
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy user từ token khi load lại trang
  useEffect(() => {
    // Đặt timeout để tránh trường hợp chờ quá lâu
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        console.warn('Auth loading timeout - forcing completion');
      }
    }, 5000);

    loadUser();

    return () => clearTimeout(timeoutId);
  }, [loadUser]);

  const login = (userData) => {
    // Ensure we have a token before setting the user
    if (!userData || !userData.token) {
      console.error('Login failed: No token provided');
      return;
    }

    // Save token to localStorage
    localStorage.setItem('token', userData.token);
    
    // Set user data in state
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear user data and token
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Tạo memoized functions để tránh re-render không cần thiết
  const updateProfile = useCallback(async (userData) => {
    try {
      const res = await authAPI.updateProfile(userData);
      const updatedUser = res.data.data;
      setUser(prev => ({ ...prev, ...updatedUser }));
      toast.success('Cập nhật thông tin thành công!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại!');
      return false;
    }
  }, []);

  const updateAvatar = useCallback(async (avatarData) => {
    try {
      const res = await authAPI.updateAvatar({ avatar: avatarData });
      const updatedUser = res.data.data;
      setUser(prev => ({ ...prev, ...updatedUser }));
      toast.success('Cập nhật ảnh đại diện thành công!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật ảnh đại diện thất bại!');
      return false;
    }
  }, []);

  const updatePassword = useCallback(async (passwordData) => {
    try {
      await authAPI.updatePassword(passwordData);
      toast.success('Cập nhật mật khẩu thành công!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật mật khẩu thất bại!');
      return false;
    }
  }, []);

  // Memoize giá trị context để tối ưu hiệu suất
  const contextValue = {
    user, 
    login, 
    logout, 
    loading, 
    isAuthenticated, 
    updateProfile,
    updateAvatar,
    updatePassword,
    refreshUser: loadUser // Thêm hàm để refresh user khi cần
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 