import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Xóa giỏ hàng khi thanh toán thành công
    clearCart();
    
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await ordersAPI.getOrder(id);
        setOrder(res.data.data);
      } catch (err) {
        setError('Không tìm thấy đơn hàng hoặc có lỗi xảy ra!');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, clearCart]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="text-center bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thành công</h2>
        
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua sắm tại TechWorld. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
        </p>
        
        {loading ? (
          <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : order ? (
          <div className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
            <p><span className="font-medium">Mã đơn hàng:</span> {order._id}</p>
            <p><span className="font-medium">Tổng tiền:</span> {order.totalPrice.toLocaleString()}₫</p>
            <p><span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethod}</p>
            <p><span className="font-medium">Trạng thái:</span> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
          </div>
        ) : null}
        
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
          <Link
            to={`/orders/${id}`}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Xem chi tiết đơn hàng
          </Link>
          
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 