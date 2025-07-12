import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../utils/api";
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Lấy đường dẫn chuyển hướng từ state nếu có
  const from = location.state?.from?.pathname || "/account";

  // Lưu trạng thái đăng nhập vào localStorage nếu người dùng đã nhập email
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Lưu email vào localStorage khi người dùng nhập
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      localStorage.setItem('savedEmail', newEmail);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Tránh submit nhiều lần
    
    setLoading(true);
    setIsSubmitting(true);
    setError("");
    
    // Hiển thị toast loading
    const loadingToast = toast.loading('Đang đăng nhập...');
    
    // Thiết lập timeout cho form
    const loginTimeout = setTimeout(() => {
      if (loading) {
        toast.dismiss(loadingToast);
        toast.error('Đăng nhập mất nhiều thời gian hơn dự kiến. Vui lòng thử lại sau.');
        setLoading(false);
        setIsSubmitting(false);
        setError('Server không phản hồi. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');
      }
    }, 30000); // 30 giây
    
    try {
      console.log('Submitting login form with email:', email);
      const res = await authAPI.login({ email, password });
      const user = res.data.data;
      
      // Xóa timeout khi thành công
      clearTimeout(loginTimeout);
      
      // Ẩn toast loading
      toast.dismiss(loadingToast);
      
      // Sử dụng hàm login từ AuthContext để lưu token và user
      login(user);
      
      toast.success("Đăng nhập thành công!");
      
      // Chuyển hướng dựa vào vai trò hoặc đường dẫn trước đó
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      // Xóa timeout khi có lỗi
      clearTimeout(loginTimeout);
      
      // Ẩn toast loading
      toast.dismiss(loadingToast);
      
      console.error('Login error:', err);
      
      let errorMessage = "Email hoặc mật khẩu không đúng!";
      
      // Xử lý các loại lỗi khác nhau
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Kết nối tới server quá chậm. Vui lòng thử lại sau.';
      } else if (!err.response) {
        errorMessage = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.response) {
        // Lấy message từ response nếu có
        errorMessage = err.response.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 rounded-full p-4 mb-2">
            <i className="fas fa-user text-2xl text-indigo-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Đăng nhập</h2>
        </div>
        
        {error && (
          <div className="bg-rose-100 text-rose-600 rounded p-2 mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={handleEmailChange}
            required
            autoFocus
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className={`w-full font-semibold py-2.5 rounded-lg transition flex items-center justify-center ${
            loading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          disabled={loading || isSubmitting}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang đăng nhập...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt mr-2"></i>
              Đăng nhập
            </>
          )}
        </button>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 