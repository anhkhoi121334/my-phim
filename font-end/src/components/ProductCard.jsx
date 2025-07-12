import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getImageUrl, handleImageError } from "../utils/imageUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faHeart, 
  faCartShopping, 
  faCartPlus, 
  faFire, 
  faStar, 
  faCheckCircle,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import toast from "react-hot-toast";

const ProductCard = ({ product, variant = "default" }) => {
  const { addToCart, cartItems } = useCart();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Check if product is already in cart
  const isInCart = cartItems?.some(item => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure product has a valid price before adding to cart
    const productToAdd = {
      ...product,
      price: product.minPrice || product.price || 0
    };
    
    addToCart(productToAdd, 1);
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  // Format price to VND currency
  const formatPrice = (price) => {
    if (!price && price !== 0) return "Liên hệ";
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate discount percentage if not provided
  const discountPercentage = product.discountPercentage || 
    (product.maxPrice && product.minPrice ? 
      Math.round(((product.maxPrice - product.minPrice) / product.maxPrice) * 100) : 0);

  // Get product image with fallback
  const productImage = getImageUrl(product.mainImage || product.images?.[0]);

  // Badge conditions
  const hasDiscount = discountPercentage > 0;
  const isBestSeller = product.isBestSeller;
  const isNew = product.isNew || (product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const isFeatured = product.isFeatured;
  const isOutOfStock = product.stock === 0 || product.outOfStock;

  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Determine which card variant to render
  const renderCard = () => {
    switch (variant) {
      case "compact":
        return renderCompactCard();
      case "horizontal":
        return renderHorizontalCard();
      case "featured":
        return renderFeaturedCard();
      case "default":
      default:
        return renderDefaultCard();
    }
  };

  // Default vertical card layout
  const renderDefaultCard = () => (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-0 left-0 p-3 flex flex-col gap-2 z-10">
        {hasDiscount && (
          <span className="bg-rose-500 text-white text-xs font-semibold py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm">
            <FontAwesomeIcon icon={faBolt} /> -{discountPercentage}%
          </span>
        )}
        
        {isNew && !hasDiscount && (
          <span className="bg-green-500 text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-sm">
            Mới
          </span>
        )}
      </div>
      
      {/* Right side badges */}
      <div className="absolute top-0 right-0 p-3 flex flex-col gap-2 items-end z-10">
        {isBestSeller && (
          <span className="bg-amber-500 text-white text-xs font-semibold py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm">
            <FontAwesomeIcon icon={faFire} /> Bán chạy
          </span>
        )}
        
        {isFeatured && !isBestSeller && (
          <span className="bg-indigo-500 text-white text-xs font-semibold py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm">
            <FontAwesomeIcon icon={faCheckCircle} /> Nổi bật
          </span>
        )}
      </div>
      
      <Link to={`/products/${product._id}`} className="relative block flex-shrink-0">
        {/* Product Image with loading state */}
        <div className="relative overflow-hidden aspect-square">
          {isImageLoading && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={productImage}
            alt={product.name} 
            className={`w-full h-full object-cover object-center transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: isImageLoading ? 0 : 1 }}
          />
          
          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-black/80 text-white px-4 py-2 rounded-lg font-medium">
                Hết hàng
              </span>
            </div>
          )}
          
          {/* Action Buttons Overlay */}
          <div 
            className={`absolute inset-0 bg-black/5 flex items-center justify-center gap-3
              transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}
              pointer-events-none ${isHovered ? 'pointer-events-auto' : ''}`}
          >
            <Link 
              to={`/products/${product._id}`} 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-indigo-600 
                hover:bg-indigo-600 hover:text-white transition-colors shadow-md transform hover:-translate-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-rose-500 
                hover:bg-rose-500 hover:text-white transition-colors shadow-md transform hover:-translate-y-1"
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transform hover:-translate-y-1
                ${isOutOfStock ? 
                  'bg-slate-400 text-white cursor-not-allowed' : 
                  isInCart ? 
                    'bg-green-600 text-white' : 
                    'bg-white text-green-600 hover:bg-green-600 hover:text-white transition-colors'
                }`}
            >
              <FontAwesomeIcon icon={isInCart ? faCheckCircle : faCartShopping} />
            </button>
          </div>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        {product.categoryName && (
          <div className="mb-2">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 py-1 px-2 rounded-md">
              {product.categoryName}
            </span>
          </div>
        )}
        
        {/* Product Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-slate-800 text-base mt-1 line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating & Reviews */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`text-xs ${star <= Math.round(product.rating) ? 'opacity-100' : 'opacity-30'}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-600 ml-1">
              ({product.reviewCount || 0} đánh giá)
            </span>
          </div>
        )}
        
        {/* Description - optional, only shown if space allows */}
        {product.shortDescription && (
          <p className="text-slate-600 text-sm mt-2 line-clamp-2 flex-grow">
            {product.shortDescription}
          </p>
        )}
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-800">
              {formatPrice(product.minPrice || product.price)}
            </span>
            {product.maxPrice && product.maxPrice > product.minPrice && (
              <span className="text-slate-400 text-xs line-through">
                {formatPrice(product.maxPrice)}
              </span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm flex items-center gap-1 transform hover:scale-105 transition-all
              ${isOutOfStock ? 
                'bg-slate-400 text-white cursor-not-allowed' : 
                isInCart ? 
                  'bg-green-600 text-white' : 
                  'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
            <FontAwesomeIcon icon={isInCart ? faCheckCircle : faCartPlus} />
            <span>{isInCart ? 'Đã thêm' : 'Thêm'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Compact card layout (smaller, less information)
  const renderCompactCard = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200">
      <Link to={`/products/${product._id}`} className="block">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-rose-500 text-white text-xs font-medium py-0.5 px-2 rounded-full">
              -{discountPercentage}%
            </span>
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square">
          {isImageLoading && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>
          )}
          <img 
            src={productImage}
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: isImageLoading ? 0 : 1 }}
          />
        </div>
        
        {/* Product Info */}
        <div className="p-2">
          {/* Product Name */}
          <h3 className="font-medium text-slate-800 text-sm line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-slate-800">
              {formatPrice(product.minPrice || product.price)}
            </span>
            {product.rating && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xs" />
                <span className="text-xs text-slate-600 ml-1">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );

  // Horizontal card layout
  const renderHorizontalCard = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200">
      <div className="flex">
        <Link to={`/products/${product._id}`} className="relative w-1/3 flex-shrink-0">
          {/* Product Image */}
          <div className="relative overflow-hidden h-full">
            {isImageLoading && (
              <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>
            )}
            <img 
              src={productImage}
              alt={product.name} 
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ opacity: isImageLoading ? 0 : 1 }}
            />
            
            {/* Discount Badge */}
            {hasDiscount && (
              <span className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-medium py-0.5 px-2 rounded-full z-10">
                -{discountPercentage}%
              </span>
            )}
          </div>
        </Link>
        
        {/* Product Info */}
        <div className="p-3 flex-grow flex flex-col">
          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={`text-xs ${star <= Math.round(product.rating) ? 'opacity-100' : 'opacity-30'}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Description */}
          <p className="text-slate-600 text-xs mt-1 line-clamp-2 flex-grow">
            {product.shortDescription || product.description}
          </p>
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">
                {formatPrice(product.minPrice || product.price)}
              </span>
              {product.maxPrice && product.maxPrice > product.minPrice && (
                <span className="text-slate-400 text-xs line-through">
                  {formatPrice(product.maxPrice)}
                </span>
              )}
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2 rounded-lg flex items-center justify-center ${
                isOutOfStock ? 
                  'bg-slate-300 cursor-not-allowed' : 
                  isInCart ? 
                    'bg-green-600 text-white' : 
                    'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <FontAwesomeIcon icon={isInCart ? faCheckCircle : faCartPlus} className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Featured card layout (larger, more prominent)
  const renderFeaturedCard = () => (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md overflow-hidden border border-indigo-100 transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        {/* Badges */}
        <div className="absolute top-0 left-0 p-3 z-10">
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-sm font-semibold py-1 px-3 rounded-full shadow-sm flex items-center gap-1">
              <FontAwesomeIcon icon={faBolt} /> -{discountPercentage}%
            </span>
          )}
        </div>
        
        <div className="absolute top-0 right-0 p-3 z-10">
          {isFeatured && (
            <span className="bg-indigo-600 text-white text-sm font-semibold py-1 px-3 rounded-full shadow-sm flex items-center gap-1">
              <FontAwesomeIcon icon={faCheckCircle} /> Sản phẩm nổi bật
            </span>
          )}
        </div>
        
        <Link to={`/products/${product._id}`} className="block">
          {/* Product Image */}
          <div className="relative overflow-hidden aspect-video">
            {isImageLoading && (
              <div className="absolute inset-0 bg-indigo-100 animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={productImage}
              alt={product.name} 
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ opacity: isImageLoading ? 0 : 1 }}
            />
          </div>
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        {product.categoryName && (
          <div className="mb-2">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 py-1 px-3 rounded-md">
              {product.categoryName}
            </span>
          </div>
        )}
        
        {/* Product Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-slate-800 text-xl hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`text-sm ${star <= Math.round(product.rating) ? 'opacity-100' : 'opacity-30'}`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600 ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-slate-600 mt-3 line-clamp-3">
          {product.shortDescription || product.description}
        </p>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-slate-800">
              {formatPrice(product.minPrice || product.price)}
            </span>
            {product.maxPrice && product.maxPrice > product.minPrice && (
              <span className="text-slate-400 text-sm line-through">
                {formatPrice(product.maxPrice)}
              </span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 shadow-sm transition-all hover:scale-105 ${
              isOutOfStock ? 
                'bg-slate-400 cursor-not-allowed' : 
                isInCart ? 
                  'bg-green-600' : 
                  'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <FontAwesomeIcon icon={isInCart ? faCheckCircle : faCartPlus} />
            <span>{isInCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return renderCard();
};

export default ProductCard; 