import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faBoxOpen, faShoppingCart, faUsers, 
  faMoneyBillWave, faArrowUp, faArrowDown, faEye,
  faTag, faCalendarAlt, faExclamationCircle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { productsAPI, usersAPI, ordersAPI, categoriesAPI } from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    salesPerformance: 5.3, // Percentage of increase/decrease
    bestSellingProducts: [],
    recentOrders: [],
    topCustomers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real application, you'd fetch this data from your backend
        // For now, we'll simulate it with mocked data
        const randomSales = Math.floor(Math.random() * 1000000) + 500000;
        const randomOrders = Math.floor(Math.random() * 1000) + 200;
        const randomProducts = Math.floor(Math.random() * 500) + 100;
        const randomCustomers = Math.floor(Math.random() * 2000) + 500;
        const randomPendingOrders = Math.floor(Math.random() * 50) + 10;
        const randomLowStock = Math.floor(Math.random() * 20) + 5;
        
        // Create mock data for best selling products
        const mockBestSellers = [
          { _id: '1', name: 'iPhone 14 Pro Max', price: 28990000, sold: 54, image: 'https://picsum.photos/200/300?random=1' },
          { _id: '2', name: 'Samsung Galaxy S23 Ultra', price: 26990000, sold: 48, image: 'https://picsum.photos/200/300?random=2' },
          { _id: '3', name: 'MacBook Pro M2', price: 35990000, sold: 42, image: 'https://picsum.photos/200/300?random=3' },
          { _id: '4', name: 'AirPods Pro 2', price: 6790000, sold: 36, image: 'https://picsum.photos/200/300?random=4' },
          { _id: '5', name: 'iPad Air', price: 15990000, sold: 30, image: 'https://picsum.photos/200/300?random=5' },
        ];
        
        // Create mock data for recent orders
        const mockRecentOrders = [
          { _id: 'ORD123456', customer: 'Nguyễn Văn A', total: 32990000, date: new Date(Date.now() - 3600000), status: 'Đang xử lý' },
          { _id: 'ORD123455', customer: 'Trần Thị B', total: 26990000, date: new Date(Date.now() - 7200000), status: 'Đã giao hàng' },
          { _id: 'ORD123454', customer: 'Lê Văn C', total: 15990000, date: new Date(Date.now() - 10800000), status: 'Đã thanh toán' },
          { _id: 'ORD123453', customer: 'Phạm Thị D', total: 8990000, date: new Date(Date.now() - 14400000), status: 'Đang giao hàng' },
          { _id: 'ORD123452', customer: 'Hoàng Văn E', total: 42990000, date: new Date(Date.now() - 18000000), status: 'Đã giao hàng' },
        ];
        
        // Create mock data for top customers
        const mockTopCustomers = [
          { _id: 'USR123456', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', orderCount: 12, totalSpent: 125000000 },
          { _id: 'USR123455', name: 'Trần Thị B', email: 'tranthib@example.com', orderCount: 8, totalSpent: 89000000 },
          { _id: 'USR123454', name: 'Lê Văn C', email: 'levanc@example.com', orderCount: 6, totalSpent: 75000000 },
        ];
        
        setStats({
          totalSales: randomSales,
          totalOrders: randomOrders,
          totalProducts: randomProducts,
          totalCustomers: randomCustomers,
          pendingOrders: randomPendingOrders,
          lowStockProducts: randomLowStock,
          salesPerformance: 5.3,
          bestSellingProducts: mockBestSellers,
          recentOrders: mockRecentOrders,
          topCustomers: mockTopCustomers
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Check if user is admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // Format number to Vietnamese currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date to Vietnamese format
  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã giao hàng':
        return 'bg-green-100 text-green-800';
      case 'Đang giao hàng':
        return 'bg-blue-100 text-blue-800';
      case 'Đã thanh toán':
        return 'bg-indigo-100 text-indigo-800';
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Xem tổng quan về hoạt động của cửa hàng</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalSales)}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${stats.salesPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <FontAwesomeIcon icon={stats.salesPerformance >= 0 ? faArrowUp : faArrowDown} className="mr-1" />
                    {Math.abs(stats.salesPerformance)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>
          
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-gray-500">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1 text-yellow-500" />
                    {stats.pendingOrders} đơn đang chờ xử lý
                </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faShoppingCart} className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng sản phẩm</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-gray-500">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1 text-red-500" />
                    {stats.lowStockProducts} sản phẩm sắp hết hàng
                  </span>
                </div>
      </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faBoxOpen} className="text-green-600 text-xl" />
              </div>
        </div>
      </div>
      
          {/* Total Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
          <div>
                <p className="text-sm text-gray-500 mb-1">Tổng khách hàng</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-gray-500">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-green-500" />
                    50 khách hàng mới trong tháng
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-purple-600 text-xl" />
              </div>
          </div>
          </div>
        </div>
        
        {/* Best Selling Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Best Selling Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Sản phẩm bán chạy</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                <FontAwesomeIcon icon={faEye} className="mr-1" />
                Xem tất cả
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.bestSellingProducts.map((product, index) => (
                <div key={product._id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">Đã bán: {product.sold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-gray-500">SKU: P{product._id}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
      
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Đơn hàng gần đây</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                <FontAwesomeIcon icon={faEye} className="mr-1" />
                Xem tất cả
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map(order => (
                <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">#{order._id}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Khách hàng hàng đầu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số đơn hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng chi tiêu
                  </th>
            </tr>
          </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topCustomers.map(customer => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.orderCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 