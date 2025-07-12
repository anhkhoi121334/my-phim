import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import WishlistButton from '../WishlistButton';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleAddToCart = () => {
    // Ensure product has a valid price before adding to cart
    const productToAdd = {
      ...product,
      price: product.price || 0
    };
    
    addToCart(productToAdd, 1);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative pt-[100%]">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        
        {/* Wishlist button */}
        <div className="absolute top-3 right-3">
          <WishlistButton productId={product._id} size="md" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link
          to={`/products/${product._id}`}
          className="block text-lg font-semibold text-gray-900 hover:text-blue-600 truncate mb-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="text-lg font-bold text-blue-600">
            {formatPrice(product.price * (1 - (product.discount || 0) / 100))}
          </div>
          {product.discount > 0 && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {product.rating || 0} ({product.numReviews || 0})
          </div>
          <div className="text-sm text-gray-500">
            Đã bán {product.soldCount || 0}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 