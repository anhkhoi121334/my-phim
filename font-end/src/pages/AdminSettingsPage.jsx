import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faStore, faGlobe, faEnvelope, 
  faTruck, faCreditCard, faUser, faCheck
} from '@fortawesome/free-solid-svg-icons';

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
          <p className="text-gray-600">Quản lý cài đặt hệ thống</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                <li>
                  <button 
                    onClick={() => setActiveTab('general')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'general' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCog} className="w-5 h-5 mr-3" />
                    Cài đặt chung
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('store')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'store' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faStore} className="w-5 h-5 mr-3" />
                    Thông tin cửa hàng
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('shipping')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'shipping' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faTruck} className="w-5 h-5 mr-3" />
                    Vận chuyển
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'payment' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 mr-3" />
                    Thanh toán
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('notification')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'notification' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mr-3" />
                    Thông báo
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('seo')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'seo' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faGlobe} className="w-5 h-5 mr-3" />
                    SEO & Liên kết
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('user')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'user' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-3" />
                    Người dùng
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
              {/* Success message */}
              {savedSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  <span>Cài đặt đã được lưu thành công!</span>
                </div>
              )}

              {activeTab === 'general' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Cài đặt chung</h2>
                  <form onSubmit={handleSaveSettings}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên cửa hàng
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="TechWorld"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo
                      </label>
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                          <img src="/placeholder-logo.png" alt="Logo" className="max-w-full max-h-full" />
                        </div>
                        <button type="button" className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700">
                          Thay đổi
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Múi giờ
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                        <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                        <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Định dạng ngày
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đơn vị tiền tệ
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="VND">VND - Việt Nam Đồng</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-indigo-600 mr-2" defaultChecked />
                        <span className="text-sm text-gray-700">Kích hoạt chế độ bảo trì</span>
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'store' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Thông tin cửa hàng</h2>
                  <form onSubmit={handleSaveSettings}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên công ty
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="TechWorld Corporation"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="123 Nguyễn Văn Linh, Quận 7"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thành phố
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="TP. Hồ Chí Minh"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quốc gia
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="VN">Việt Nam</option>
                        <option value="US">United States</option>
                        <option value="SG">Singapore</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã bưu điện
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="700000"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="(+84) 28 1234 5678"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email liên hệ
                      </label>
                      <input 
                        type="email" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="contact@techworld.com"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Add placeholders for other tabs */}
              {activeTab === 'shipping' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Cài đặt vận chuyển</h2>
                  <p className="text-gray-600">Cài đặt các phương thức vận chuyển và phí vận chuyển.</p>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Cài đặt thanh toán</h2>
                  <p className="text-gray-600">Cài đặt các phương thức thanh toán và cổng thanh toán.</p>
                </div>
              )}

              {activeTab === 'notification' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Cài đặt thông báo</h2>
                  <p className="text-gray-600">Cài đặt thông báo email và thông báo hệ thống.</p>
                </div>
              )}

              {activeTab === 'seo' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Cài đặt SEO & Liên kết</h2>
                  <p className="text-gray-600">Cài đặt các thông tin SEO và liên kết mạng xã hội.</p>
                </div>
              )}

              {activeTab === 'user' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Cài đặt người dùng</h2>
                  <p className="text-gray-600">Quản lý vai trò và quyền của người dùng.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage; 