import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBell,
  faEnvelope,
  faSignOutAlt,
  faCog,
  faUserCircle,
  faBars,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = ({ onMobileMenuClick }) => {
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
    setNotificationsOpen(false);
  };
  
  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev);
    setUserDropdownOpen(false);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    // Add actual dark mode implementation here
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left section with mobile menu toggle and search */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-slate-600" onClick={onMobileMenuClick}>
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          
          <div className="relative hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faSearch} className="text-slate-400" />
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="pl-10 pr-4 py-2 w-72 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" 
            />
          </div>
        </div>
        
        {/* Right section with icons and user profile */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100"
            onClick={toggleDarkMode}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-slate-600" />
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 relative"
              onClick={toggleNotifications}
            >
              <FontAwesomeIcon icon={faBell} className="text-slate-600" />
              <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Notifications dropdown */}
            <div className={`absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-slate-200 transition-all duration-200 origin-top-right ${
              notificationsOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
            }`}>
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Thông báo</h3>
                <button className="text-xs text-indigo-600">Đánh dấu tất cả đã đọc</button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {/* Notification items */}
                <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faEnvelope} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">Bạn có 5 đơn hàng mới cần xử lý</p>
                      <p className="text-xs text-slate-500 mt-1">30 phút trước</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faUserCircle} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">Có 3 người dùng mới đăng ký</p>
                      <p className="text-xs text-slate-500 mt-1">2 giờ trước</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 hover:bg-slate-50">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faBell} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">Hệ thống vừa được cập nhật lên phiên bản mới</p>
                      <p className="text-xs text-slate-500 mt-1">1 ngày trước</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-2 border-t border-slate-100">
                <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 py-1">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          </div>
          
          {/* User profile */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={toggleUserDropdown}
              className="flex items-center gap-3 hover:bg-slate-50 rounded-lg p-2"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin User')}&background=6366f1&color=fff`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-800 leading-tight">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-500 leading-tight">Quản trị viên</p>
              </div>
            </button>
            
            {/* User dropdown menu */}
            <div className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-slate-200 transition-all duration-200 origin-top-right ${
              userDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
            }`}>
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-medium text-slate-800">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-slate-500">{user?.email || 'admin@example.com'}</p>
              </div>
              
              <Link 
                to="/admin/profile" 
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setUserDropdownOpen(false)}
              >
                <FontAwesomeIcon icon={faUserCircle} className="mr-2 text-indigo-500" />
                Hồ sơ của tôi
              </Link>
              
              <Link 
                to="/admin/settings" 
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setUserDropdownOpen(false)}
              >
                <FontAwesomeIcon icon={faCog} className="mr-2 text-indigo-500" />
                Cài đặt
              </Link>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 