import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { authAPI } from '../utils/api';
import LoadingOverlay from '../components/LoadingOverlay';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Fetch wishlist khi component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchWishlist();
  }, [user, navigate]);
  
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getWishlist();
      setWishlist(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveFromWishlist = async (productId) => {
    try {
      setLoading(true);
      await authAPI.removeFromWishlist(productId);
      // Cập nhật lại danh sách sau khi xóa
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <LoadingOverlay />}
      
      <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>
      
      {wishlist.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
          <Link 
            to="/products" 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <Link to={`/products/${product.slug}`}>
                  <img 
                    src={product.mainImage} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <button 
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/products/${product.slug}`} className="block">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-indigo-600">{product.name}</h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={i < Math.floor(product.averageRating) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-1">({product.numReviews})</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-indigo-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.minPrice)}
                  </p>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition duration-300"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 