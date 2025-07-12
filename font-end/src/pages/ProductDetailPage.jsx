import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productsAPI, categoriesAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import WishlistButton from '../components/WishlistButton';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const { data: productData, isLoading, isError, error } = useQuery(
    ['product', id],
    () => productsAPI.getProduct(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const product = productData?.data?.data;
  
  const categoryId = typeof product?.category === 'string' ? product.category : product?.category?._id;
  
  const { data: categoryData } = useQuery(
    ['category', categoryId],
    () => categoriesAPI.getCategory(categoryId),
    {
      enabled: !!categoryId && typeof product?.category === 'string',
      refetchOnWindowFocus: false,
    }
  );
  
  const categoryName = typeof product?.category === 'object' && product?.category?.name 
    ? product.category.name 
    : categoryData?.data?.data?.name || 'Chưa phân loại';

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>Error loading product: {error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-lg p-2 mb-4 h-80 md:h-96 flex items-center justify-center">
            <img
              src={product.mainImage || 'https://via.placeholder.com/600x600'}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[product.mainImage, ...(product.images || [])].map((image, index) => (
              <div
                key={index}
                className={`border rounded cursor-pointer ${
                  activeImageIndex === index ? 'border-indigo-500' : 'border-gray-200'
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={image || 'https://via.placeholder.com/100x100'}
                  alt={`${product.name} thumbnail ${index}`}
                  className="h-20 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.brand}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < (product.averageRating || 0) ? '' : 'text-gray-300'}`}></i>
              ))}
            </div>
            <span className="text-gray-500">({product.numReviews || 0} đánh giá)</span>
          </div>
          
          <div className="mb-6">
            <span className="text-3xl font-bold text-indigo-600">
              {product.basePrice?.toLocaleString()}₫
            </span>
            {product.discount > 0 && (
              <span className="text-xl text-gray-500 line-through ml-2">
                {(product.basePrice * (1 + product.discount / 100)).toLocaleString()}₫
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">{product.shortDescription}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Số lượng</label>
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-2 border-r border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    className="w-16 text-center py-2 border-none focus:outline-none"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-2 border-l border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Trạng thái</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium flex items-center justify-center ${
                  product.stock > 0
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <i className="fas fa-shopping-cart mr-3 text-lg"></i>
                <span className="text-base">Thêm vào giỏ hàng</span>
              </button>
              
              <div className="flex items-center justify-center w-14 h-14 rounded-lg border border-gray-200 hover:bg-gray-50">
                <WishlistButton productId={product._id} />
              </div>
              
              <button 
                className="flex items-center justify-center px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                title="Chia sẻ sản phẩm"
              >
                <i className="fas fa-share-alt mr-2 text-gray-600"></i>
                <span className="text-gray-700">Chia sẻ</span>
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-gray-600 font-medium">Mã sản phẩm:</span>
                <span className="ml-2 text-indigo-600">
                  {product.sku || 
                   (product.variants && product.variants.length > 0 ? product.variants[0].sku : 'Chưa có mã')}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-gray-600 font-medium">Danh mục:</span>
                <span className="ml-2 text-indigo-600">
                  {categoryName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mô tả
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thông số kỹ thuật
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đánh giá ({product.numReviews || 0})
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <table className="w-full">
                <tbody>
                  {product.specifications && product.specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{spec.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{spec.value} {spec.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="text-center py-6">
              <p className="text-gray-500">Chưa có đánh giá nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
