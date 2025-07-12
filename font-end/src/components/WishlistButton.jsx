import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const WishlistButton = ({ productId, size = 'md' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && productId) {
      checkWishlistStatus();
    }
  }, [user, productId]);
  
  const checkWishlistStatus = async () => {
    try {
      const response = await authAPI.getWishlist();
      const wishlist = response.data.data || [];
      setIsInWishlist(wishlist.some(item => item._id === productId));
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái wishlist:', error);
    }
  };
  
  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isInWishlist) {
        await authAPI.removeFromWishlist(productId);
        toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
      } else {
        await authAPI.addToWishlist(productId);
        toast.success('Đã thêm sản phẩm vào danh sách yêu thích');
      }
      
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Lỗi khi cập nhật wishlist:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Xác định kích thước của nút dựa trên prop size
  const buttonClasses = {
    sm: 'p-1 rounded-full',
    md: 'p-2 rounded-full',
    lg: 'p-3 rounded-full'
  };
  
  const iconClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`${buttonClasses[size]} bg-white shadow hover:bg-gray-100 transition-colors duration-200 relative`}
      aria-label={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      {loading ? (
        <div className={`${iconClasses[size]} animate-pulse`}>
          <svg className="animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${iconClasses[size]} ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`} 
          fill={isInWishlist ? 'currentColor' : 'none'}
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
    </button>
  );
};

export default WishlistButton; 