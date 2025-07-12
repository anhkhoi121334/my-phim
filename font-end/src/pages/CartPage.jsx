import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl, handleImageError } from "../utils/imageUtils";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const navigate = useNavigate();

  const total = getTotal();

  // Format price to VND currency
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0₫";
    return price.toLocaleString() + "₫";
  };

  // Empty cart state
  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-8 rounded-xl shadow-lg mt-8 mx-4 lg:mx-auto lg:max-w-4xl">
        <div className="text-center">
          <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 animate-fadeIn">Giỏ hàng trống</h2>
          <p className="text-gray-600 text-lg mb-6">Có vẻ bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link
            to="/products"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <i className="fas fa-store mr-2"></i> Khám phá sản phẩm ngay!
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
        <i className="fas fa-shopping-cart mr-3 text-indigo-600"></i>Giỏ hàng của bạn
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="lg:w-2/3 bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="hidden md:grid md:grid-cols-12 bg-gray-100 p-4 text-sm font-medium text-gray-600 uppercase">
            <div className="md:col-span-6">Sản phẩm</div>
            <div className="md:col-span-2 text-center">Giá</div>
            <div className="md:col-span-2 text-center">Số lượng</div>
            <div className="md:col-span-2 text-center">Thành tiền</div>
          </div>

          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={`${item._id}-${item.variant?.id || 'default'}`} className="p-4 md:grid md:grid-cols-12 items-center hover:bg-gray-50 transition">
                {/* Product info - mobile and desktop */}
                <div className="md:col-span-6 flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={getImageUrl(item.image)}
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item._id}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition">
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500">
                        {item.variant.name}
                        {item.variant.color && (
                          <span className="inline-block ml-2">
                            <span 
                              className="w-3 h-3 inline-block rounded-full border border-gray-300 mr-1" 
                              style={{ backgroundColor: item.variant.color.hex || '#ccc' }}
                            ></span>
                          </span>
                        )}
                      </p>
                    )}
                    <button
                      onClick={() => removeFromCart(item._id, item.variant?.id)}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center"
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Xóa
                    </button>
                  </div>
                </div>

                {/* Price - mobile and desktop */}
                <div className="md:col-span-2 flex justify-between md:block text-center mb-2 md:mb-0">
                  <span className="md:hidden text-gray-500">Giá:</span>
                  <span className="text-gray-900 font-medium">{formatPrice(item.price)}</span>
                </div>

                {/* Quantity - mobile and desktop */}
                <div className="md:col-span-2 flex justify-between md:justify-center items-center mb-2 md:mb-0">
                  <span className="md:hidden text-gray-500">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1), item.variant?.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value), item.variant?.id)}
                      className="w-12 border-0 text-center focus:ring-0 p-0 text-gray-900"
                    />
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1, item.variant?.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Subtotal - mobile and desktop */}
                <div className="md:col-span-2 flex justify-between md:block text-center">
                  <span className="md:hidden text-gray-500">Thành tiền:</span>
                  <span className="text-indigo-600 font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tổng sản phẩm</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tổng số lượng</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Tạm tính</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-indigo-600">{formatPrice(total)}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Đã bao gồm VAT (nếu có)</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/order")}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <i className="fas fa-credit-card mr-2"></i> Tiến hành thanh toán
              </button>
              
              <button
                onClick={() => navigate("/products")}
                className="w-full py-3 px-4 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center"
              >
                <i className="fas fa-arrow-left mr-2"></i> Tiếp tục mua sắm
              </button>
              
              <button
                onClick={clearCart}
                className="w-full py-2 px-4 text-gray-600 text-sm hover:text-red-600 transition flex items-center justify-center"
              >
                <i className="fas fa-trash-alt mr-2"></i> Xóa tất cả giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;