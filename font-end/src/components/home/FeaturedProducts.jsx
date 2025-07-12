import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart, faCartPlus, faPlus, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { productsAPI } from '../../utils/api';
import { categoriesAPI } from '../../utils/api';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';

const getStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(1); // full star
    } else if (i === fullStars && hasHalfStar) {
      stars.push(0.5); // half star
    } else {
      stars.push(0); // empty star
    }
  }

  return stars;
};

const FeaturedProducts = ({ hideTitle = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [categories, setCategories] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const filterRef = useRef(null);

  useEffect(() => {
    categoriesAPI.getCategories()
      .then(res => {
        setCategories(res.data.data || []);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    let params = {};
    if (activeFilter !== "Tất cả") {
      const selectedCat = categories.find(cat => cat.name === activeFilter);
      if (selectedCat) {
        params = { category: selectedCat._id };
      }
    }
    productsAPI.getProducts(params)
      .then(res => {
        const allProducts = res.data.data || [];
        setProducts(allProducts.slice(0, 8));
      })
      .catch(err => {
        setError(err.toString());
      })
      .finally(() => setLoading(false));
  }, [activeFilter, categories]);

  // Fetch trạng thái wishlist khi user thay đổi
  useEffect(() => {
    if (user) {
      fetchWishlistStatus();
    } else {
      setWishlistStatus({}); // Reset khi user logout
    }
  }, [user]);

  // Add horizontal scroll with mouse wheel
  useEffect(() => {
    const handleWheel = (e) => {
      if (filterRef.current) {
        if (e.deltaY !== 0) {
          e.preventDefault();
          filterRef.current.scrollLeft += e.deltaY;
        }
      }
    };

    const currentFilterRef = filterRef.current;
    if (currentFilterRef) {
      currentFilterRef.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (currentFilterRef) {
        currentFilterRef.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const fetchWishlistStatus = async () => {
    try {
      const response = await authAPI.getWishlist();
      const wishlist = response.data.data || [];
      
      // Tạo object lưu trạng thái wishlist của từng sản phẩm
      const status = {};
      wishlist.forEach(item => {
        status[item._id] = true;
      });
      
      setWishlistStatus(status);
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái wishlist:', error);
    }
  };

  const handleAddToWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      navigate('/login');
      return;
    }
    
    try {
      if (wishlistStatus[productId]) {
        // Nếu sản phẩm đã có trong wishlist, xóa khỏi wishlist
        await authAPI.removeFromWishlist(productId);
        toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
        setWishlistStatus(prev => ({
          ...prev,
          [productId]: false
        }));
      } else {
        // Nếu sản phẩm chưa có trong wishlist, thêm vào wishlist
        await authAPI.addToWishlist(productId);
        toast.success('Đã thêm sản phẩm vào danh sách yêu thích');
        setWishlistStatus(prev => ({
          ...prev,
          [productId]: true
        }));
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật wishlist:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <section id="featured-products" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 text-sm sm:text-base">Những sản phẩm công nghệ hot nhất hiện nay</p>
          </div>
          
          <Link to="/products" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center text-sm">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div 
          ref={filterRef}
          className="flex overflow-x-auto py-2 mb-6 gap-3 no-scrollbar scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <button
            key="Tất cả"
            className={`flex-shrink-0 px-5 py-2.5 rounded-full whitespace-nowrap transition-colors duration-200 text-sm font-medium
              ${activeFilter === "Tất cả" 
                ? 'bg-indigo-600 text-white border border-indigo-600' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-500 hover:bg-gray-50'}`}
            onClick={() => setActiveFilter("Tất cả")}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full whitespace-nowrap transition-colors duration-200 text-sm font-medium
                ${activeFilter === cat.name 
                  ? 'bg-indigo-600 text-white border border-indigo-600' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-500 hover:bg-gray-50'}`}
              onClick={() => setActiveFilter(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-500 bg-rose-50 rounded-xl">
            <i className="fas fa-exclamation-circle text-3xl mb-2"></i>
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-box-open text-slate-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">Không tìm thấy sản phẩm</h3>
            <p className="mb-4 text-slate-500">Không có sản phẩm nào trong danh mục này</p>
            <button 
              onClick={() => setActiveFilter("Tất cả")}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <Link
                key={p._id || idx}
                to={`/products/${p._id}`}
                className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                <div className="relative overflow-hidden pt-[100%]">
                  {/* Product badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {p.isFeatured && (
                      <span className="px-3 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                        Nổi bật
                      </span>
                    )}
                    {p.discount > 0 && (
                      <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                        -{p.discount}%
                      </span>
                    )}
                    {p.isNew && (
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        Mới
                      </span>
                    )}
                  </div>
                  
                  {/* Wishlist button */}
                  <button 
                    className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${wishlistStatus[p._id] ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
                    onClick={(e) => handleAddToWishlist(e, p._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  
                  {/* Product image */}
                  <img 
                    src={getImageUrl(p.mainImage || p.images?.[0])} 
                    alt={p.name} 
                    className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Quick action overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center transition-opacity duration-300">
                    <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                        <span>Thêm vào giỏ</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Brand & Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 py-1 px-2 rounded">
                      {p.brand || p.categoryName || "Công nghệ"}
                    </span>
                    <div className="flex items-center">
                      <div className="flex text-amber-400 text-xs">
                        {getStars(p.averageRating || 5).map((s, i) =>
                          s === 1 ? (
                            <FontAwesomeIcon key={i} icon={faStar} />
                          ) : s === 0.5 ? (
                            <FontAwesomeIcon key={i} icon={faStarHalfAlt} />
                          ) : (
                            <FontAwesomeIcon key={i} icon={faStar} className="text-gray-200" />
                          )
                        )}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">
                        ({p.averageRating?.toFixed(1) || '5.0'})
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 h-10 group-hover:text-indigo-600 transition-colors">
                    {p.name}
                  </h3>
                  
                  {/* Short Description */}
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2 h-9">
                    {p.shortDescription || p.description}
                  </p>
                  
                  {/* Price & Add button */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div>
                      <span className="font-bold text-gray-800">{p.minPrice?.toLocaleString('vi-VN', {style:'currency',currency:'VND'}) || '--'}</span>
                      {p.maxPrice && p.maxPrice > p.minPrice && (
                        <span className="text-gray-400 text-xs line-through ml-1">{p.maxPrice.toLocaleString('vi-VN', {style:'currency',currency:'VND'})}</span>
                      )}
                    </div>
                    <button 
                      className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full hover:bg-indigo-600 hover:text-white transition" 
                      onClick={(e) => handleAddToCart(e, p)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/products" className="inline-block bg-indigo-600 text-white py-2.5 px-6 rounded-full font-medium hover:bg-indigo-700 transition shadow-sm hover:shadow-md">
              Xem tất cả sản phẩm
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts; 