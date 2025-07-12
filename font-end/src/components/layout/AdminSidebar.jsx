import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faBox,
  faTags,
  faTicketAlt,
  faShoppingCart,
  faUsers,
  faCog,
  faUserCircle,
  faSignOutAlt,
  faBullhorn,
  faChartLine,
  faImages
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <aside className="w-72 h-screen bg-white shadow-lg fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center transform rotate-12">
            <FontAwesomeIcon icon={faChartPie} className="text-white text-xl" />
          </div>
          <div>
            <span className="text-xl font-bold text-indigo-600">TechWorld</span>
            <p className="text-xs text-slate-500 mt-0.5">Hệ thống quản trị</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase mt-3 mb-2 px-2">Tổng quan</p>
        
        <Link to="/admin" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/') || isActive('/admin') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faChartPie} className="w-5 mr-3" />
          <span>Dashboard</span>
        </Link>
        
        <Link to="/admin/analytics" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/analytics') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faChartLine} className="w-5 mr-3" />
          <span>Phân tích</span>
        </Link>
        
        <Link to="/admin/marketing" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/marketing') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faBullhorn} className="w-5 mr-3" />
          <span>Marketing</span>
        </Link>

        <Link to="/admin/banners" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/banners') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faImages} className="w-5 mr-3" />
          <span>Quản lý Banner</span>
        </Link>
        
        <p className="text-xs font-semibold text-slate-400 uppercase mt-6 mb-2 px-2">Quản lý</p>
        
        <Link to="/admin/products" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/products') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faBox} className="w-5 mr-3" />
          <span>Sản phẩm</span>
        </Link>
        
        <Link to="/admin/categories" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/categories') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faTags} className="w-5 mr-3" />
          <span>Danh mục</span>
        </Link>
        
        <Link to="/admin/coupons" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/coupons') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faTicketAlt} className="w-5 mr-3" />
          <span>Mã giảm giá</span>
        </Link>
        
        <Link to="/admin/orders" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/orders') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faShoppingCart} className="w-5 mr-3" />
          <span>Đơn hàng</span>
        </Link>
        
        <p className="text-xs font-semibold text-slate-400 uppercase mt-6 mb-2 px-2">Người dùng</p>
        
        <Link to="/admin/customers" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/customers') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faUsers} className="w-5 mr-3" />
          <span>Khách hàng</span>
        </Link>
        
        <p className="text-xs font-semibold text-slate-400 uppercase mt-6 mb-2 px-2">Cài đặt</p>
        
        <Link to="/admin/settings" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/settings') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faCog} className="w-5 mr-3" />
          <span>Cài đặt</span>
        </Link>
        
        <Link to="/admin/account" className={`sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 ${
          isActive('/admin/account') 
            ? 'bg-indigo-50 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}>
          <FontAwesomeIcon icon={faUserCircle} className="w-5 mr-3" />
          <span>Tài khoản</span>
        </Link>
        
        <Link to="/logout" className="sidebar-link flex items-center py-3 px-4 rounded-lg mb-1 text-rose-600 hover:bg-rose-50">
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 mr-3" />
          <span>Đăng xuất</span>
        </Link>
      </nav>

      <div className="mx-4 mt-6 mb-6 p-4 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl text-white">
        <h4 className="font-medium mb-1">Cần trợ giúp?</h4>
        <p className="text-xs text-indigo-100 mb-3">Liên hệ với đội hỗ trợ của chúng tôi</p>
        <button className="text-xs bg-white text-indigo-700 py-1.5 px-3 rounded-lg font-medium">
          Trung tâm hỗ trợ
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar; 