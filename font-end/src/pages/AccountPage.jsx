import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faClipboardList,
  faMapMarkerAlt,
  faHeart,
  faShieldAlt,
  faSignOutAlt,
  faEdit,
  faSave,
  faTimes,
  faCamera,
  faLink,
  faUpload,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, ordersAPI } from '../utils/api';
import LoadingOverlay from '../components/LoadingOverlay';

const AccountPage = () => {
  const { user, logout, updateProfile, updateAvatar, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  // Thêm state cho ảnh đại diện
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // State cho đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordChanging, setPasswordChanging] = useState(false);
  
  // State cho địa chỉ
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    postalCode: '',
    country: 'Việt Nam',
    isDefault: false
  });
  
  // Tính toán xem mật khẩu mới và xác nhận có khớp không
  const passwordsMatch = 
    !passwordForm.confirmPassword || 
    passwordForm.newPassword === passwordForm.confirmPassword;

  // Dữ liệu mẫu cho đơn hàng
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Dữ liệu mẫu cho sản phẩm yêu thích
  const wishlist = [
    {
      id: 1,
      name: 'iPhone 13 Pro Max',
      image: 'https://via.placeholder.com/100',
      price: '28.990.000 ₫',
      oldPrice: '32.990.000 ₫',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S22 Ultra',
      image: 'https://via.placeholder.com/100',
      price: '25.990.000 ₫',
      oldPrice: '29.990.000 ₫',
    },
    {
      id: 3,
      name: 'Xiaomi Mi 11 Lite',
      image: 'https://via.placeholder.com/100',
      price: '7.990.000 ₫',
      oldPrice: '8.990.000 ₫',
    },
  ];

  // Fetch địa chỉ khi component mounted hoặc tab thay đổi
  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  // Hàm fetch địa chỉ từ API
  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const response = await authAPI.getAddresses();
      setAddresses(response.data.data);
    } catch (error) {
      console.error('Fetch addresses error:', error);
      toast.error('Không thể tải địa chỉ. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  // Xử lý thay đổi input mật khẩu
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  // Xử lý tải ảnh từ máy tính
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
        setShowAvatarOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý cập nhật ảnh từ URL
  const handleAvatarUrlSubmit = () => {
    if (avatarUrlInput) {
      setAvatarUrl(avatarUrlInput);
      setShowAvatarOptions(false);
      setAvatarUrlInput('');
    } else {
      toast.error("Vui lòng nhập URL hình ảnh");
    }
  };

  const handleSaveProfile = async () => {
    // Hiển thị trạng thái đang tải
    const loadingToast = toast.loading("Đang cập nhật...");
    
    try {
      // Kiểm tra xem avatar có thay đổi không
      const avatarChanged = avatarUrl !== user?.avatar;
      
      // Cập nhật thông tin cơ bản
      const profileData = {
        name: userForm.name,
        phone: userForm.phone
      };
      
      const profileUpdated = await updateProfile(profileData);
      
      // Nếu cập nhật hồ sơ thành công và ảnh đại diện có thay đổi
      if (profileUpdated && avatarChanged) {
        await updateAvatar(avatarUrl);
      }
      
      // Xử lý kết quả thành công
      toast.dismiss(loadingToast);
      setIsEditing(false);
    } catch (error) {
      // Xử lý lỗi
      toast.dismiss(loadingToast);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
      console.error("Update profile error:", error);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu mới và xác nhận
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    setPasswordChanging(true);
    
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error("Change password error:", error);
    } finally {
      setPasswordChanging(false);
    }
  };

  // Xử lý thêm/sửa địa chỉ
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Reset form địa chỉ
  const resetAddressForm = () => {
    setAddressForm({
      name: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      postalCode: '',
      country: 'Việt Nam',
      isDefault: false
    });
    setEditingAddress(null);
  };

  // Mở modal thêm địa chỉ mới
  const openAddAddressModal = () => {
    resetAddressForm();
    setShowAddressModal(true);
  };

  // Mở modal sửa địa chỉ
  const openEditAddressModal = (address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      district: address.district || '',
      ward: address.ward || '',
      postalCode: address.postalCode || '',
      country: address.country || 'Việt Nam',
      isDefault: address.isDefault || false
    });
    setShowAddressModal(true);
  };

  // Lưu địa chỉ mới/đã sửa
  const handleSaveAddress = async () => {
    // Kiểm tra dữ liệu
    if (!addressForm.name || !addressForm.phone || !addressForm.address || !addressForm.city) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const loadingToast = toast.loading(editingAddress ? 'Đang cập nhật địa chỉ...' : 'Đang thêm địa chỉ mới...');
    
    try {
      if (editingAddress) {
        // Cập nhật địa chỉ
        await authAPI.updateAddress(editingAddress._id, addressForm);
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        // Thêm địa chỉ mới
        await authAPI.addAddress(addressForm);
        toast.success('Thêm địa chỉ mới thành công');
      }
      
      // Tải lại danh sách địa chỉ
      await fetchAddresses();
      setShowAddressModal(false);
      resetAddressForm();
    } catch (error) {
      console.error('Save address error:', error);
      toast.error(editingAddress ? 'Lỗi khi cập nhật địa chỉ' : 'Lỗi khi thêm địa chỉ');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      const loadingToast = toast.loading('Đang xóa địa chỉ...');
      
      try {
        await authAPI.deleteAddress(addressId);
        toast.success('Xóa địa chỉ thành công');
        await fetchAddresses();
      } catch (error) {
        console.error('Delete address error:', error);
        toast.error('Lỗi khi xóa địa chỉ');
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  // Xử lý đặt địa chỉ mặc định
  const handleSetDefaultAddress = async (addressId) => {
    const loadingToast = toast.loading('Đang cập nhật địa chỉ mặc định...');
    
    try {
      await authAPI.setDefaultAddress(addressId);
      toast.success('Đã đặt địa chỉ mặc định');
      await fetchAddresses();
    } catch (error) {
      console.error('Set default address error:', error);
      toast.error('Lỗi khi đặt địa chỉ mặc định');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hiển thị nội dung tương ứng với tab được chọn
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Thông tin tài khoản</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" /> Lưu
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarUrl(user?.avatar || '');
                      setShowAvatarOptions(false);
                    }}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Hủy
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl font-bold border-2 border-indigo-500">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold text-gray-800">{user?.name}</h4>
                    <p className="text-gray-600">{user?.email}</p>
                    {user?.phone && <p className="text-gray-600">{user.phone}</p>}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium">{user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-4">
                {/* Phần cập nhật ảnh đại diện */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-3xl font-bold border-2 border-indigo-500">
                        {userForm.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
                    >
                      <FontAwesomeIcon icon={faCamera} />
                    </button>
                  </div>

                  {showAvatarOptions && (
                    <div className="mt-3 p-3 border border-gray-200 rounded-lg shadow-sm w-full max-w-md">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center">
                          <input
                            type="text"
                            placeholder="Nhập URL hình ảnh"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={avatarUrlInput}
                            onChange={(e) => setAvatarUrlInput(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleAvatarUrlSubmit}
                            className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700"
                          >
                            <FontAwesomeIcon icon={faLink} className="mr-1" /> Cập nhật
                          </button>
                        </div>
                        <div className="text-center">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center w-full"
                            >
                              <FontAwesomeIcon icon={faUpload} className="mr-2" /> Tải ảnh từ máy tính
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      value={userForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Đơn hàng của tôi</h3>
            
            {loadingOrders ? (
              <LoadingOverlay />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">MÃ ĐƠN HÀNG</th>
                      <th className="px-4 py-2 border">SẢN PHẨM</th>
                      <th className="px-4 py-2 border">NGÀY ĐẶT</th>
                      <th className="px-4 py-2 border">TRẠNG THÁI</th>
                      <th className="px-4 py-2 border">TỔNG TIỀN</th>
                      <th className="px-4 py-2 border">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">Bạn chưa có đơn hàng nào.</td>
                      </tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order._id}>
                          <td className="px-4 py-2 border font-semibold">ORD-{order._id.slice(-5).toUpperCase()}</td>
                          <td className="px-4 py-2 border">{order.orderItems.length} sản phẩm</td>
                          <td className="px-4 py-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 border">{renderStatus(order)}</td>
                          <td className="px-4 py-2 border">{order.totalPrice.toLocaleString()} ₫</td>
                          <td className="px-4 py-2 border">
                            <div className="flex flex-col space-y-1">
                            <Link to={`/orders/${order._id}`} className="text-indigo-600 hover:underline">Chi tiết</Link>
                              {order.isPaid && !order.isDelivered && (
                                <Link to={`/orders/${order._id}/tracking`} className="text-green-600 hover:underline flex items-center text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                  </svg>
                                  Theo dõi
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'addresses':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Địa chỉ của tôi</h3>
              <button 
                onClick={openAddAddressModal}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Thêm địa chỉ mới
              </button>
            </div>

            {isLoadingAddresses ? (
              <div className="text-center py-8">
                <div className="inline-block">
                  <LoadingOverlay visible={true} />
                </div>
                <p className="mt-2 text-gray-600">Đang tải địa chỉ...</p>
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border rounded-lg p-4 relative ${
                      address.isDefault ? 'border-indigo-500' : 'border-gray-200'
                    }`}
                  >
                    {address.isDefault && (
                      <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                        Mặc định
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{address.name}</h4>
                        <p className="text-gray-600 mt-1">{address.phone}</p>
                        <p className="text-gray-600 mt-2">
                          {address.address}
                          {address.ward && `, ${address.ward}`}
                          {address.district && `, ${address.district}`}
                          {address.city && `, ${address.city}`}
                          {address.postalCode && ` (${address.postalCode})`}
                        </p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button 
                        onClick={() => openEditAddressModal(address)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Chỉnh sửa
                      </button>
                      {!address.isDefault && (
                        <>
                          <span className="text-gray-300">|</span>
                          <button 
                            onClick={() => handleSetDefaultAddress(address._id)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Đặt làm mặc định
                          </button>
                          <span className="text-gray-300">|</span>
                          <button 
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-3">Bạn chưa có địa chỉ nào</div>
                <button 
                  onClick={openAddAddressModal}
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Thêm địa chỉ mới
                </button>
              </div>
            )}

            {/* Modal Thêm/Sửa địa chỉ */}
            {showAddressModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                      </h3>
                      <button 
                        onClick={() => setShowAddressModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                    
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={addressForm.name}
                          onChange={handleAddressFormChange}
                          placeholder="Ví dụ: Nhà riêng, Công ty..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={addressForm.phone}
                          onChange={handleAddressFormChange}
                          placeholder="Số điện thoại người nhận"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ chi tiết <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={addressForm.address}
                          onChange={handleAddressFormChange}
                          placeholder="Số nhà, tên đường, tòa nhà..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phường/Xã
                          </label>
                          <input
                            type="text"
                            name="ward"
                            value={addressForm.ward}
                            onChange={handleAddressFormChange}
                            placeholder="Phường/Xã"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quận/Huyện
                          </label>
                          <input
                            type="text"
                            name="district"
                            value={addressForm.district}
                            onChange={handleAddressFormChange}
                            placeholder="Quận/Huyện"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressFormChange}
                            placeholder="Tỉnh/Thành phố"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã bưu điện
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={addressForm.postalCode}
                            onChange={handleAddressFormChange}
                            placeholder="Mã bưu điện (nếu có)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quốc gia
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={addressForm.isDefault}
                          onChange={handleAddressFormChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                          Đặt làm địa chỉ mặc định
                        </label>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          {editingAddress ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'wishlist':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Sản phẩm yêu thích</h3>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="flex items-center">
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-800">{product.name}</h4>
                        <div className="mt-1">
                          <span className="text-indigo-600 font-medium">{product.price}</span>
                          {product.oldPrice && (
                            <span className="text-gray-400 text-sm line-through ml-2">{product.oldPrice}</span>
                          )}
                        </div>
                        <button className="mt-2 text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-3">Bạn chưa có sản phẩm yêu thích nào</div>
                <Link to="/products" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Mua sắm ngay
                </Link>
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Cài đặt bảo mật</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h4 className="text-lg font-medium text-indigo-700 mb-2">Đổi mật khẩu</h4>
                
                <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className={`w-full px-4 py-2 border ${
                        passwordsMatch ? 'border-gray-300' : 'border-red-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      required
                    />
                    {!passwordsMatch && (
                      <p className="text-xs text-red-500 mt-1">Mật khẩu xác nhận không khớp</p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordChanging || !passwordsMatch}
                      className={`px-4 py-2 rounded-lg text-white font-medium ${
                        passwordChanging || !passwordsMatch
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {passwordChanging ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium text-gray-700 mb-1">Bảo mật tài khoản</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Bảo vệ tài khoản của bạn bằng cách sử dụng mật khẩu mạnh và thay đổi mật khẩu định kỳ.
                </p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
                    </span>
                    <span className="text-gray-700">Sử dụng mật khẩu mạnh kết hợp chữ, số và ký tự đặc biệt</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
                    </span>
                    <span className="text-gray-700">Thay đổi mật khẩu định kỳ mỗi 3 tháng</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
                    </span>
                    <span className="text-gray-700">Không chia sẻ mật khẩu với người khác</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await ordersAPI.getMyOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      toast.error('Không thể tải đơn hàng!');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Hàm render trạng thái có màu
  const renderStatus = (order) => {
    if (order.isCancelled) {
      return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Đã hủy</span>;
    }
    if (order.isDelivered) {
      return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Đã giao hàng</span>;
    }
    if (order.isPaid) {
      return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">Đang xử lý</span>;
    }
    return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">Chưa thanh toán</span>;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bạn cần đăng nhập để xem trang này</h2>
          <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-6">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xl font-bold border-2 border-indigo-500">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg ${
                    activeTab === 'profile'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3" />
                  Thông tin tài khoản
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg ${
                    activeTab === 'orders'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faClipboardList} className="mr-3" />
                  Đơn hàng của tôi
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg ${
                    activeTab === 'addresses'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                  Địa chỉ của tôi
                </button>
                
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg ${
                    activeTab === 'wishlist'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} className="mr-3" />
                  Sản phẩm yêu thích
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg ${
                    activeTab === 'security'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-3" />
                  Bảo mật tài khoản
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 