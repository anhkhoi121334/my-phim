import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faUser, faSearch, faEdit, 
  faTrash, faEnvelope, faPhone, faCalendarAlt,
  faShoppingBag, faSort, faChartLine, faEye,
  faUserPlus, faTimes
} from '@fortawesome/free-solid-svg-icons';

const AdminCustomersPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Mock data for customers
  const mockCustomers = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
      registeredDate: '2023-01-15',
      orders: 12,
      totalSpent: 52500000,
      status: 'active',
      lastOrder: '2024-07-02',
      avatar: ''
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0909876543',
      address: '456 Lê Văn Lương, Quận 4, TP. Hồ Chí Minh',
      registeredDate: '2023-03-21',
      orders: 8,
      totalSpent: 35900000,
      status: 'active',
      lastOrder: '2024-06-25',
      avatar: ''
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0908765432',
      address: '789 Điện Biên Phủ, Quận 3, TP. Hồ Chí Minh',
      registeredDate: '2023-05-10',
      orders: 5,
      totalSpent: 18700000,
      status: 'inactive',
      lastOrder: '2024-04-12',
      avatar: ''
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      phone: '0907654321',
      address: '101 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
      registeredDate: '2023-07-07',
      orders: 9,
      totalSpent: 40200000,
      status: 'active',
      lastOrder: '2024-06-30',
      avatar: ''
    },
    {
      id: '5',
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      phone: '0906543210',
      address: '202 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh',
      registeredDate: '2023-10-19',
      orders: 3,
      totalSpent: 12300000,
      status: 'active',
      lastOrder: '2024-05-17',
      avatar: ''
    }
  ];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch customers from your API
        setCustomers(mockCustomers);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle view customer details
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sorted and filtered customers
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Get status badge
  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Khách hàng</h1>
            <p className="text-gray-600">Quản lý thông tin khách hàng</p>
          </div>
          <button 
            onClick={() => setShowAddCustomer(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Thêm khách hàng
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white" 
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại" 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Tên khách hàng
                      {sortField === 'name' && (
                        <FontAwesomeIcon 
                          icon={faSort} 
                          className="ml-1 text-indigo-600" 
                        />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('registeredDate')}
                  >
                    <div className="flex items-center">
                      Ngày đăng ký
                      {sortField === 'registeredDate' && (
                        <FontAwesomeIcon 
                          icon={faSort} 
                          className="ml-1 text-indigo-600" 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('orders')}
                  >
                    <div className="flex items-center">
                      Đơn hàng
                      {sortField === 'orders' && (
                        <FontAwesomeIcon 
                          icon={faSort} 
                          className="ml-1 text-indigo-600" 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('totalSpent')}
                  >
                    <div className="flex items-center">
                      Tổng chi tiêu
                      {sortField === 'totalSpent' && (
                        <FontAwesomeIcon 
                          icon={faSort} 
                          className="ml-1 text-indigo-600" 
                        />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <span className="text-indigo-600 font-semibold text-lg">
                              {customer.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-1" />
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center mt-1">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-1" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-1" />
                        {formatDate(customer.registeredDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faShoppingBag} className="text-indigo-400 mr-1" />
                        {customer.orders}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Gần nhất: {formatDate(customer.lastOrder)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faChartLine} className="text-green-500 mr-1" />
                        {formatCurrency(customer.totalSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(customer.status)}`}>
                        {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewCustomer(customer)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showCustomerDetail && selectedCustomer && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowCustomerDetail(false)}></div>
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Thông tin khách hàng
                </h3>
                <button 
                  onClick={() => setShowCustomerDetail(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  {selectedCustomer.avatar ? (
                    <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="h-20 w-20 rounded-full" />
                  ) : (
                    <span className="text-indigo-600 font-bold text-3xl">
                      {selectedCustomer.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                  <p className="text-sm text-gray-600">Khách hàng ID: {selectedCustomer.id}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(selectedCustomer.status)}`}>
                      {selectedCustomer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin liên hệ</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2 mt-1" />
                      <span className="text-sm text-gray-900">{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin tài khoản</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Ngày đăng ký:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(selectedCustomer.registeredDate)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Tổng đơn hàng:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCustomer.orders}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Đơn hàng gần nhất:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(selectedCustomer.lastOrder)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tổng chi tiêu:</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(selectedCustomer.totalSpent)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                  Xem đơn hàng
                </button>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowAddCustomer(false)}></div>
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Thêm khách hàng mới
                </h3>
                <button 
                  onClick={() => setShowAddCustomer(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Form này chỉ là mẫu UI. Trong ứng dụng thực tế, form này sẽ có đầy đủ các trường và chức năng submit.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                      placeholder="Nhập địa chỉ"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddCustomer(false)}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => setShowAddCustomer(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 border border-transparent rounded-md shadow-sm text-sm"
                >
                  Thêm khách hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomersPage; 