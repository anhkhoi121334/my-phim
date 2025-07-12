import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';

const OrderFailedPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông báo lỗi từ query params (nếu có)
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get('message') || 'Thanh toán không thành công';

  useEffect(() => {
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
  }, [id]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="text-center bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thất bại</h2>
        
        <p className="text-gray-600 mb-6">
          {errorMessage}
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
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailedPage; 