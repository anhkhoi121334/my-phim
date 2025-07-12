import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart, faSearch, faFilter, faEye, 
  faTruck, faCheck, faTimes, faCalendarAlt, 
  faUser, faMoneyBillWave, faDownload, faPrint
} from '@fortawesome/free-solid-svg-icons';

const AdminOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for orders
  const mockOrders = [
    {
      id: 'ORD-001234',
      customer: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      date: '2024-07-10T08:30:00',
      total: 12590000,
      status: 'completed',
      payment: 'Đã thanh toán',
      paymentMethod: 'MoMo',
      items: [
        { id: 1, name: 'iPhone 14 Pro Max', quantity: 1, price: 28990000, discount: 500000 },
        { id: 2, name: 'Ốp lưng iPhone 14 Pro Max', quantity: 2, price: 550000, discount: 0 }
      ],
      shippingAddress: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
      shippingMethod: 'Express',
      shippingFee: 0,
      trackingNumber: 'VN123456789'
    },
    {
      id: 'ORD-001235',
      customer: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0909876543',
      date: '2024-07-10T10:15:00',
      total: 25990000,
      status: 'processing',
      payment: 'Đã thanh toán',
      paymentMethod: 'Thẻ tín dụng',
      items: [
        { id: 3, name: 'MacBook Air M2', quantity: 1, price: 25990000, discount: 0 }
      ],
      shippingAddress: '456 Lê Văn Lương, Quận 4, TP. Hồ Chí Minh',
      shippingMethod: 'Standard',
      shippingFee: 30000,
      trackingNumber: ''
    },
    {
      id: 'ORD-001236',
      customer: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0908765432',
      date: '2024-07-10T12:45:00',
      total: 8900000,
      status: 'shipping',
      payment: 'Đã thanh toán',
      paymentMethod: 'Banking',
      items: [
        { id: 4, name: 'iPad 10.2-inch', quantity: 1, price: 8900000, discount: 0 }
      ],
      shippingAddress: '789 Điện Biên Phủ, Quận 3, TP. Hồ Chí Minh',
      shippingMethod: 'Express',
      shippingFee: 0,
      trackingNumber: 'VN987654321'
    },
    {
      id: 'ORD-001237',
      customer: 'Phạm Thị D',
      email: 'phamthid@example.com',
      phone: '0907654321',
      date: '2024-07-10T14:20:00',
      total: 4590000,
      status: 'cancelled',
      payment: 'Chưa thanh toán',
      paymentMethod: 'COD',
      items: [
        { id: 5, name: 'Samsung Galaxy Watch 5', quantity: 1, price: 4590000, discount: 0 }
      ],
      shippingAddress: '101 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
      shippingMethod: 'Standard',
      shippingFee: 30000,
      trackingNumber: ''
    },
    {
      id: 'ORD-001238',
      customer: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      phone: '0906543210',
      date: '2024-07-10T15:50:00',
      total: 33990000,
      status: 'pending',
      payment: 'Chưa thanh toán',
      paymentMethod: 'Banking',
      items: [
        { id: 6, name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 28990000, discount: 0 },
        { id: 7, name: 'Galaxy Buds 3 Pro', quantity: 1, price: 5000000, discount: 0 }
      ],
      shippingAddress: '202 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh',
      shippingMethod: 'Express',
      shippingFee: 0,
      trackingNumber: ''
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch orders from your API
        setOrders(mockOrders);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-indigo-100 text-indigo-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text in Vietnamese
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return faCheck;
      case 'processing':
        return faShoppingCart;
      case 'shipping':
        return faTruck;
      case 'pending':
        return faCalendarAlt;
      case 'cancelled':
        return faTimes;
      default:
        return faCalendarAlt;
    }
  };

  // Handle view order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  // Filter orders by status
  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  // Search orders by ID or customer name
  const searchedOrders = filteredOrders.filter(order => {
    if (!searchTerm) return true;
    return (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Xem và quản lý tất cả đơn hàng</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'pending' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Chờ xử lý
            </button>
            <button 
              onClick={() => setFilterStatus('processing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'processing' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đang xử lý
            </button>
            <button 
              onClick={() => setFilterStatus('shipping')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'shipping' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đang giao hàng
            </button>
            <button 
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'completed' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Hoàn thành
            </button>
            <button 
              onClick={() => setFilterStatus('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'cancelled' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đã hủy
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white" 
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faUser} className="text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          <div className="text-xs text-gray-500">{order.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-400" />
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                        <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-1" />
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <FontAwesomeIcon 
                          icon={faMoneyBillWave} 
                          className={`mr-1 ${order.payment === 'Đã thanh toán' ? 'text-green-500' : 'text-yellow-500'}`} 
                        />
                        {order.payment}
                      </div>
                      <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewOrderDetails(order)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowOrderDetail(false)}></div>
          <div className="relative bg-white rounded-lg max-w-4xl w-full mx-auto shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.id}
                </h3>
                <button 
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin khách hàng</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">{selectedOrder.customer}</p>
                    <p className="text-sm text-gray-600 mb-1">{selectedOrder.email}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin đơn hàng</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Ngày đặt:</span>
                      <span className="text-sm text-gray-900">{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <span className={`text-sm font-medium ${selectedOrder.status === 'completed' ? 'text-green-600' : selectedOrder.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Thanh toán:</span>
                      <span className="text-sm text-gray-900">{selectedOrder.payment} ({selectedOrder.paymentMethod})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Địa chỉ giao hàng</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900 mb-1">{selectedOrder.shippingAddress}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">Phương thức vận chuyển:</span>
                    <span className="text-sm text-gray-900">{selectedOrder.shippingMethod}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">Mã vận đơn:</span>
                      <span className="text-sm font-medium text-indigo-600">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Sản phẩm</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Sản phẩm
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Số lượng
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Đơn giá
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Giảm giá
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.discount > 0 ? formatCurrency(item.discount) : '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            {formatCurrency((item.price * item.quantity) - item.discount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tạm tính:</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(
                      selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Giảm giá:</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(
                      selectedOrder.items.reduce((sum, item) => sum + item.discount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                  <span className="text-sm text-gray-900">
                    {selectedOrder.shippingFee > 0 ? formatCurrency(selectedOrder.shippingFee) : 'Miễn phí'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-medium text-gray-900">Tổng cộng:</span>
                  <span className="text-base font-bold text-gray-900">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <FontAwesomeIcon icon={faPrint} className="mr-2" />
                    In đơn hàng
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Xuất PDF
                  </button>
                </div>
                <div className="flex space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Hủy đơn
                      </button>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Xác nhận
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                      <FontAwesomeIcon icon={faTruck} className="mr-2" />
                      Vận chuyển
                    </button>
                  )}
                  {selectedOrder.status === 'shipping' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Hoàn thành
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage; 