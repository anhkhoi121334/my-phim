import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullhorn, faEdit, faTrash, faPlus, faEnvelope, 
  faHashtag, faCheck, faTimes, faCalendarAlt, 
  faPercentage, faStar, faTag, faUsers, faEye
} from '@fortawesome/free-solid-svg-icons';

const AdminMarketingPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Black Friday Sale 2024',
      status: 'active',
      startDate: '2024-11-25',
      endDate: '2024-11-30',
      budget: 12000000,
      audience: 'Khách hàng hiện tại',
      metrics: { impressions: 25000, clicks: 3200, conversions: 920 }
    },
    {
      id: '2',
      name: 'Khuyến mãi Tết 2025',
      status: 'scheduled',
      startDate: '2025-01-15',
      endDate: '2025-01-31',
      budget: 15000000,
      audience: 'Tất cả khách hàng',
      metrics: { impressions: 0, clicks: 0, conversions: 0 }
    },
    {
      id: '3',
      name: 'Khai trương cửa hàng mới',
      status: 'completed',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      budget: 8000000,
      audience: 'Khách hàng tiềm năng',
      metrics: { impressions: 18500, clicks: 2100, conversions: 420 }
    },
    {
      id: '4',
      name: 'Giảm giá Sinh nhật thương hiệu',
      status: 'active',
      startDate: '2024-07-01',
      endDate: '2024-07-07',
      budget: 5000000,
      audience: 'Tất cả khách hàng',
      metrics: { impressions: 8200, clicks: 950, conversions: 180 }
    }
  ]);

  const [promotions, setPromotions] = useState([
    {
      id: '1',
      name: 'Giảm 20% cho đơn hàng trên 1 triệu',
      type: 'Giảm giá phần trăm',
      value: '20%',
      status: 'active',
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      products: 'Tất cả sản phẩm',
      usage: 235
    },
    {
      id: '2',
      name: 'Mua 1 tặng 1 với phụ kiện',
      type: 'Combo khuyến mãi',
      value: 'Mua 1 tặng 1',
      status: 'active',
      startDate: '2024-07-15',
      endDate: '2024-08-15',
      products: 'Phụ kiện',
      usage: 98
    },
    {
      id: '3',
      name: 'Freeship cho đơn hàng từ 500k',
      type: 'Miễn phí vận chuyển',
      value: 'Miễn phí',
      status: 'scheduled',
      startDate: '2024-08-01',
      endDate: '2024-08-15',
      products: 'Tất cả sản phẩm',
      usage: 0
    },
    {
      id: '4',
      name: 'Flash Sale iPhone',
      type: 'Giảm giá cố định',
      value: '1.000.000đ',
      status: 'completed',
      startDate: '2024-06-20',
      endDate: '2024-06-22',
      products: 'iPhone',
      usage: 75
    }
  ]);
  
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: '1',
      name: 'Chào mừng khách hàng mới',
      subject: 'Chào mừng bạn đến với TechWorld!',
      lastEdited: '2024-06-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Thông báo giảm giá',
      subject: 'Ưu đãi đặc biệt dành riêng cho bạn!',
      lastEdited: '2024-06-10',
      status: 'active'
    },
    {
      id: '3',
      name: 'Đơn hàng bị hủy',
      subject: 'Đơn hàng của bạn đã bị hủy',
      lastEdited: '2024-05-28',
      status: 'inactive'
    },
    {
      id: '4',
      name: 'Nhắc nhở giỏ hàng',
      subject: 'Bạn còn sản phẩm trong giỏ hàng!',
      lastEdited: '2024-06-01',
      status: 'active'
    }
  ]);

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch data from your API
        // For this example, we'll use the mock data already set in state
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching marketing data:', error);
        setLoading(false);
      }
    };

    fetchMarketingData();
  }, []);

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleOpenModal = (type, id = null) => {
    setModalType(type);
    setShowModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'scheduled':
        return 'Đã lên lịch';
      case 'completed':
        return 'Đã kết thúc';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Marketing</h1>
          <p className="text-gray-600">Quản lý chiến dịch quảng cáo và khuyến mãi</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('campaigns')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'campaigns' 
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faBullhorn} className="mr-2" />
              Chiến dịch
            </button>
            <button 
              onClick={() => setActiveTab('promotions')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'promotions' 
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faTag} className="mr-2" />
              Khuyến mãi
            </button>
            <button 
              onClick={() => setActiveTab('email')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'email' 
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email Marketing
            </button>
          </nav>
        </div>

        {/* Action Button */}
        <div className="mb-6 flex justify-end">
          <button 
            onClick={() => handleOpenModal(`new_${activeTab.slice(0, -1)}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            {activeTab === 'campaigns' ? 'Tạo chiến dịch mới' : 
             activeTab === 'promotions' ? 'Tạo khuyến mãi mới' : 'Tạo mẫu email mới'}
          </button>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên chiến dịch
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngân sách
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hiệu suất
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faBullhorn} className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-xs text-gray-500">Đối tượng: {campaign.audience}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-400" />
                          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(campaign.budget)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {campaign.status !== 'scheduled' ? (
                          <div>
                            <div className="text-xs text-gray-500">
                              <FontAwesomeIcon icon={faEye} className="mr-1" />
                              {campaign.metrics.impressions.toLocaleString()} lượt xem
                            </div>
                            <div className="text-xs text-gray-500">
                              <FontAwesomeIcon icon={faUsers} className="mr-1" />
                              {campaign.metrics.clicks.toLocaleString()} lượt click
                            </div>
                            <div className="text-xs text-gray-500">
                              <FontAwesomeIcon icon={faCheck} className="mr-1" />
                              {campaign.metrics.conversions.toLocaleString()} chuyển đổi
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Chưa có dữ liệu</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
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
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên khuyến mãi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lượt sử dụng
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promotions.map((promotion) => (
                    <tr key={promotion.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faTag} className="text-amber-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{promotion.name}</div>
                            <div className="text-xs text-gray-500">{promotion.products}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {promotion.type === 'Giảm giá phần trăm' && <FontAwesomeIcon icon={faPercentage} className="mr-1 text-green-500" />}
                          {promotion.type === 'Giảm giá cố định' && <FontAwesomeIcon icon={faTag} className="mr-1 text-blue-500" />}
                          {promotion.type === 'Miễn phí vận chuyển' && <FontAwesomeIcon icon={faCheck} className="mr-1 text-indigo-500" />}
                          {promotion.type === 'Combo khuyến mãi' && <FontAwesomeIcon icon={faStar} className="mr-1 text-amber-500" />}
                          {promotion.type}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{promotion.value}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-400" />
                          {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(promotion.status)}`}>
                          {getStatusText(promotion.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{promotion.usage.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
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
        )}

        {/* Email Marketing Tab */}
        {activeTab === 'email' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên mẫu email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cập nhật cuối
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emailTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{template.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(template.status)}`}>
                          {template.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-400" />
                          {formatDate(template.lastEdited)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <FontAwesomeIcon icon={faEnvelope} />
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
        )}
      </div>

      {/* Modal for creating/editing campaigns, promotions or email templates */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'new_campaign' ? 'Tạo chiến dịch mới' : 
                 modalType === 'new_promotion' ? 'Tạo khuyến mãi mới' : 'Tạo mẫu email mới'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Form này chỉ là mẫu UI. Trong ứng dụng thực tế, form này sẽ có đầy đủ các trường cần thiết và chức năng submit.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm"
              >
                Hủy
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 border border-transparent rounded-md shadow-sm text-sm"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMarketingPage; 