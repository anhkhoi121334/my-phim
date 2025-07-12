import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import LoadingOverlay from '../components/LoadingOverlay';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(0);
  
  // Mock data for delivery tracking (would come from the backend in a real implementation)
  const [deliveryInfo, setDeliveryInfo] = useState({
    driverName: 'Nguyễn Văn A',
    driverPhone: '0912345678',
    vehicleInfo: 'Honda Wave - 51F1-12345',
    estimatedTime: 25, // minutes
    distance: 3.5, // km
    currentLocation: {
      lat: 10.762622,
      lng: 106.660172
    },
    statusUpdates: [
      { time: '10:15', status: 'Đã nhận đơn hàng', completed: true },
      { time: '10:20', status: 'Đang chuẩn bị hàng', completed: true },
      { time: '10:35', status: 'Đã lấy hàng, đang giao', completed: true },
      { time: '10:55', status: 'Đang giao đến địa chỉ của bạn', completed: false },
      { time: '11:05', status: 'Đã giao hàng thành công', completed: false }
    ]
  });
  
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await ordersAPI.getOrder(id);
        setOrder(res.data.data);
        
        // Set the current status based on order state
        if (res.data.data.isDelivered) {
          setCurrentStatus(4); // Completed
        } else if (res.data.data.isPaid) {
          setCurrentStatus(2); // In progress
        } else {
          setCurrentStatus(0); // Just started
        }
      } catch (err) {
        setError('Không tìm thấy đơn hàng hoặc có lỗi xảy ra!');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    
    // Simulate progress updates (in a real app, this would be via WebSockets or polling)
    const interval = setInterval(() => {
      setDeliveryInfo(prev => {
        // Reduce estimated time
        const newEstimatedTime = Math.max(0, prev.estimatedTime - 1);
        
        // Update driver position (simulate movement)
        const newLocation = {
          lat: prev.currentLocation.lat + (Math.random() * 0.0002 - 0.0001),
          lng: prev.currentLocation.lng + (Math.random() * 0.0002 - 0.0001)
        };
        
        // Progress through statuses
        if (newEstimatedTime < 20 && !prev.statusUpdates[3].completed) {
          const newStatusUpdates = [...prev.statusUpdates];
          newStatusUpdates[3].completed = true;
          setCurrentStatus(3);
          return {
            ...prev,
            estimatedTime: newEstimatedTime,
            currentLocation: newLocation,
            statusUpdates: newStatusUpdates
          };
        }
        
        return {
          ...prev,
          estimatedTime: newEstimatedTime,
          currentLocation: newLocation
        };
      });
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header with delivery status */}
        <div className="bg-indigo-600 text-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Theo dõi đơn hàng</h1>
            <span className="text-sm bg-indigo-700 px-3 py-1 rounded-full">
              ORD-{order._id.slice(-5).toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-indigo-100">Đặt lúc {new Date(order.createdAt).toLocaleTimeString()} - {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        
        {/* Delivery progress bar */}
        <div className="px-4 py-5">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
              <div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                style={{ width: `${currentStatus * 25}%` }}></div>
            </div>
            <div className="flex justify-between">
              {deliveryInfo.statusUpdates.map((update, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center ${index <= currentStatus ? 'text-indigo-600' : 'text-gray-400'}`}
                  style={{width: '20%'}}
                >
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center mb-1 ${
                    index <= currentStatus ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xs text-center">{update.status}</span>
                  <span className="text-xs mt-1">{update.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Estimated delivery time */}
        <div className="bg-indigo-50 p-4 border-t border-b border-indigo-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-gray-800">Thời gian giao hàng dự kiến</h2>
              <p className="text-gray-600">Khoảng {deliveryInfo.estimatedTime} phút nữa</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Khoảng cách</p>
              <p className="font-bold text-gray-800">{deliveryInfo.distance} km</p>
            </div>
          </div>
        </div>
        
        {/* Delivery person info */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-400">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{deliveryInfo.driverName}</h3>
              <p className="text-gray-600 text-sm">Người giao hàng • {deliveryInfo.vehicleInfo}</p>
              <div className="mt-2 flex">
                <a href={`tel:${deliveryInfo.driverPhone}`} className="flex items-center mr-4 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                  </svg>
                  Gọi
                </a>
                <button className="flex items-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
                  </svg>
                  Nhắn tin
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map placeholder */}
        <div className="relative h-64 bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* In a real implementation, this would be an actual map */}
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-indigo-300 mx-auto mb-2">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-500">Đang theo dõi vị trí giao hàng...</p>
              <p className="text-xs text-gray-400 mt-1">Tọa độ: {deliveryInfo.currentLocation.lat.toFixed(6)}, {deliveryInfo.currentLocation.lng.toFixed(6)}</p>
            </div>
          </div>
        </div>
        
        {/* Order details */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-2">Chi tiết đơn hàng</h3>
          <div className="border rounded-lg overflow-hidden">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className={`flex items-center p-3 ${idx !== 0 ? 'border-t' : ''}`}>
                <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 mr-3">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="text-gray-800 font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">x{item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-medium">{item.price.toLocaleString()} ₫</p>
                </div>
              </div>
            ))}
            
            <div className="border-t p-3 bg-gray-50">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Tổng tiền hàng:</span>
                <span>{order.itemsPrice?.toLocaleString() || 0} ₫</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Phí vận chuyển:</span>
                <span>{order.shippingPrice?.toLocaleString() || 0} ₫</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 mb-1">
                  <span>Giảm giá:</span>
                  <span>-{order.discountAmount?.toLocaleString() || 0} ₫</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Tổng cộng:</span>
                <span>{order.totalPrice?.toLocaleString() || 0} ₫</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delivery address */}
        <div className="p-4 border-t">
          <h3 className="font-bold text-gray-800 mb-2">Địa chỉ giao hàng</h3>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600 mr-2 mt-0.5">
              <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-gray-800">
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t flex justify-between">
          <Link to={`/orders/${id}`} className="text-indigo-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
              <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            Chi tiết đơn hàng
          </Link>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
            </svg>
            Hủy đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage; 