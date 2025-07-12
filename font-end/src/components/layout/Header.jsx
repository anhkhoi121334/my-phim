import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrochip,
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faUserCircle,
  faClipboardList,
  faMapMarkerAlt,
  faGift,
  faHeadset,
  faSignOutAlt,
  faBars,
  faTimes,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const userMenuRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside or resizing window
  useEffect(() => {
    const handleClickOutsideMobile = (event) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideMobile);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMobile);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleUserDropdown = () => setUserDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  
  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
    }
  };

  // Calculate cart items count
  const cartItemsCount = cartItems?.length || 0;

  // Navigation links data for cleaner rendering
  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/products', label: 'Sản phẩm' },
    { path: '/promotions', label: 'Khuyến mãi' },
    { path: '/news', label: 'Tin tức' },
    { path: '/support', label: 'Hỗ trợ' },
    { path: '/contact', label: 'Liên hệ' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform rotate-12 shadow-md">
              <FontAwesomeIcon icon={faMicrochip} className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-indigo-600">TechWorld</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `nav-link font-medium transition-colors duration-200 ${
                    isActive ? 'text-indigo-600 font-semibold' : 'text-slate-700 hover:text-indigo-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search and Icons */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-64 py-2 px-4 pr-10 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-slate-400 hover:text-indigo-500 focus:outline-none"
                aria-label="Tìm kiếm"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative text-slate-600 hover:text-indigo-600 transition-colors">
              <FontAwesomeIcon icon={faHeart} className="text-xl" />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative text-slate-600 hover:text-indigo-600 transition-colors">
              <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={toggleUserDropdown} 
                className="text-slate-600 hover:text-indigo-600 flex items-center transition-colors" 
                aria-label="User menu"
              >
                {user ? (
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-slate-600" />
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              <div
                className={`absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-slate-100 transition-all duration-200 ${
                  userDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                }`}
              >
                {!user ? (
                  // Guest User
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-medium text-slate-800 mb-2">Chào mừng đến với TechWorld</p>
                    <div className="flex gap-2">
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex-1 border border-slate-300 text-slate-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Logged in User
                  <div>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link to="/account" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <FontAwesomeIcon icon={faUserCircle} className="w-5 text-indigo-500" />
                        <span>Tài khoản của tôi</span>
                      </Link>
                      
                      <Link to="/orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <FontAwesomeIcon icon={faClipboardList} className="w-5 text-indigo-500" />
                        <span>Đơn hàng của tôi</span>
                      </Link>
                      
                      <Link to="/wishlist" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <FontAwesomeIcon icon={faHeart} className="w-5 text-indigo-500" />
                        <span>Danh sách yêu thích</span>
                        <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs rounded-full px-2 py-0.5">2</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors">
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              ref={mobileMenuButtonRef}
              onClick={toggleMobileMenu}
              className="lg:hidden ml-2 p-2 text-slate-600 hover:text-indigo-600 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={mobileNavRef}
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 transition-transform duration-300 transform ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col h-full`}
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <div className="font-bold text-lg text-indigo-600">Menu</div>
            <button
              onClick={toggleMobileMenu}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none"
              aria-label="Close mobile menu"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Mobile search form */}
          <div className="p-4 border-b border-slate-100">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-slate-400 hover:text-indigo-500 focus:outline-none"
                aria-label="Tìm kiếm"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>

          {/* Mobile navigation links */}
          <nav className="flex-grow overflow-y-auto py-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-lg ${
                    isActive 
                      ? 'text-indigo-600 font-medium bg-indigo-50 border-r-4 border-indigo-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
                onClick={toggleMobileMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu footer */}
          <div className="p-4 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div className="font-medium text-slate-800">{user.name}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-rose-600 hover:text-rose-700"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMobileMenu}
                  className="flex-1 border border-slate-300 text-slate-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;