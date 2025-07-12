import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import LoadingOverlay from '../components/LoadingOverlay';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <div className="font-semibold text-lg mb-1">Mã đơn hàng: <span className="text-indigo-600">ORD-{order._id.slice(-5).toUpperCase()}</span></div>
            <div className="text-gray-500 text-sm">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            {order.isPaid && !order.isDelivered && (
              <Link 
                to={`/orders/${id}/tracking`}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded mr-2 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
                Theo dõi đơn hàng
              </Link>
            )}
            {order.isCancelled ? (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Đã hủy</span>
            ) : order.isDelivered ? (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Đã giao hàng</span>
            ) : order.isPaid ? (
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">Đang xử lý</span>
            ) : (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">Chưa thanh toán</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-medium mb-1">Địa chỉ giao hàng:</div>
          <div className="text-gray-700 text-sm">
            {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
            {order.shippingAddress?.postalCode && `, ${order.shippingAddress.postalCode}`}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-medium mb-1">Phương thức thanh toán:</div>
          <div className="text-gray-700 text-sm">{order.paymentMethod}</div>
        </div>
        <div className="mb-4">
          <div className="font-medium mb-1">Tổng tiền:</div>
          <div className="text-indigo-600 font-bold text-lg">{order.totalPrice.toLocaleString()} ₫</div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Sản phẩm</th>
                <th className="px-4 py-2 border">Số lượng</th>
                <th className="px-4 py-2 border">Đơn giá</th>
                <th className="px-4 py-2 border">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-2" />
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-2 border text-center">{item.quantity}</td>
                  <td className="px-4 py-2 border">{item.price.toLocaleString()} ₫</td>
                  <td className="px-4 py-2 border">{(item.price * item.quantity).toLocaleString()} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6">
        <Link to="/account" className="text-indigo-600 hover:underline">&larr; Quay lại tài khoản</Link>
      </div>
    </div>
  );
};

export default OrderDetailPage; 