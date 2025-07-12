import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faLock, faCheck, 
  faShield, faHistory, faBell, faTimes
} from '@fortawesome/free-solid-svg-icons';

const AdminAccountPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => {
      setProfileSuccess(false);
    }, 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
    }, 3000);
  };

  // Mock activity log data
  const activityLog = [
    { id: 1, action: 'Đăng nhập', timestamp: '2024-07-10 09:35:42', ip: '192.168.1.1', device: 'Chrome on Windows' },
    { id: 2, action: 'Cập nhật sản phẩm #P123', timestamp: '2024-07-09 15:22:18', ip: '192.168.1.1', device: 'Chrome on Windows' },
    { id: 3, action: 'Tạo đơn hàng #1234', timestamp: '2024-07-08 11:05:36', ip: '192.168.1.1', device: 'Chrome on Windows' },
    { id: 4, action: 'Đăng nhập', timestamp: '2024-07-08 08:47:19', ip: '192.168.1.1', device: 'Chrome on Windows' },
    { id: 5, action: 'Đăng xuất', timestamp: '2024-07-07 18:22:05', ip: '192.168.1.1', device: 'Chrome on Windows' },
  ];

  // Mock notification settings
  const notificationSettings = [
    { id: 1, type: 'Đơn hàng mới', email: true, browser: true },
    { id: 2, type: 'Đơn hàng bị hủy', email: true, browser: true },
    { id: 3, type: 'Sản phẩm sắp hết hàng', email: true, browser: false },
    { id: 4, type: 'Cập nhật hệ thống', email: true, browser: true },
    { id: 5, type: 'Thông báo bảo mật', email: true, browser: true },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tài khoản của tôi</h1>
          <p className="text-gray-600">Quản lý thông tin và cài đặt tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold text-xl">
                    {user?.name ? user.name.charAt(0) : 'A'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user?.name || 'Admin User'}</h3>
                  <p className="text-sm text-gray-500">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
              <ul className="divide-y divide-gray-100">
                <li>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'profile' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-3" />
                    Thông tin cá nhân
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'security' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faLock} className="w-5 h-5 mr-3" />
                    Bảo mật
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'notifications' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faBell} className="w-5 h-5 mr-3" />
                    Thông báo
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeTab === 'activity' 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faHistory} className="w-5 h-5 mr-3" />
                    Nhật ký hoạt động
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Thông tin cá nhân</h2>
                  
                  {profileSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      <span>Thông tin cá nhân đã được cập nhật thành công!</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh đại diện
                      </label>
                      <div className="flex items-center">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-indigo-600 font-bold text-2xl">
                            {user?.name ? user.name.charAt(0) : 'A'}
                          </span>
                        </div>
                        <div>
                          <button type="button" className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 mb-1 block">
                            Thay đổi ảnh
                          </button>
                          <button type="button" className="text-sm text-gray-500 hover:text-gray-700">
                            Xóa ảnh
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên
                        </label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-lg" 
                          defaultValue={user?.name || 'Admin User'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên hiển thị
                        </label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-lg" 
                          defaultValue="Admin"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input 
                        type="email" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue={user?.email || 'admin@example.com'}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        defaultValue="+84 123 456 789"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        rows="3"
                        defaultValue="123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh"
                      ></textarea>
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

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Bảo mật</h2>
                  
                  {passwordSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      <span>Mật khẩu đã được thay đổi thành công!</span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Thay đổi mật khẩu</h3>
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu hiện tại
                        </label>
                        <input 
                          type="password" 
                          className="w-full p-2 border border-gray-300 rounded-lg" 
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu mới
                        </label>
                        <input 
                          type="password" 
                          className="w-full p-2 border border-gray-300 rounded-lg" 
                          placeholder="Nhập mật khẩu mới"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Xác nhận mật khẩu mới
                        </label>
                        <input 
                          type="password" 
                          className="w-full p-2 border border-gray-300 rounded-lg" 
                          placeholder="Xác nhận mật khẩu mới"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Xác thực hai yếu tố</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Tăng cường bảo mật cho tài khoản của bạn bằng cách thêm một lớp xác thực bổ sung.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faShield} className="text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Xác thực hai yếu tố</span>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Cài đặt thông báo</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Quản lý cách bạn nhận thông báo từ hệ thống.
                  </p>
                  
                  <table className="min-w-full divide-y divide-gray-200 mb-6">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại thông báo
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trình duyệt
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {notificationSettings.map((setting) => (
                        <tr key={setting.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {setting.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center">
                              <input 
                                type="checkbox" 
                                defaultChecked={setting.email}
                                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" 
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center">
                              <input 
                                type="checkbox" 
                                defaultChecked={setting.browser}
                                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" 
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Nhật ký hoạt động</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Lịch sử các hoạt động gần đây của bạn trên hệ thống.
                  </p>
                  
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Hoạt động
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Thời gian
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            IP
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Thiết bị
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {activityLog.map((activity) => (
                          <tr key={activity.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {activity.action}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {activity.timestamp}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {activity.ip}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {activity.device}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #4f46e5;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #4f46e5;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminAccountPage; 