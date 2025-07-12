import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { couponsAPI, usersAPI } from '../utils/api';
import LoadingOverlay from '../components/LoadingOverlay';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket, faPlus, faMagic, faEdit, faTrash, 
  faPaperPlane, faCheck, faTimes, faSort, 
  faCalendar, faUser, faPercent, faCoins
} from '@fortawesome/free-solid-svg-icons';

const CouponManagementPage = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: 10,
    minimumAmount: 0,
    maximumDiscount: 0,
    startDate: new Date().toISOString().substring(0, 16),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().substring(0, 16),
    isActive: true,
    usageLimit: 100,
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendingCoupon, setSendingCoupon] = useState(false);
  const [couponForSending, setCouponForSending] = useState(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generatingCoupon, setGeneratingCoupon] = useState(false);
  const [generateFormData, setGenerateFormData] = useState({
    prefix: 'SALE',
    count: 1,
    discountType: 'percentage',
    discountAmount: 10,
    minimumAmount: 0,
    maximumDiscount: 0,
    startDate: new Date().toISOString().substring(0, 16),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().substring(0, 16),
    usageLimit: 1,
    isActive: true,
    description: 'Mã giảm giá tự động'
  });

  // Kiểm tra quyền admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponsAPI.getCoupons();
      if (response.data.success) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await usersAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Chuyển đổi ngày tháng cho phù hợp
    const couponData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      discountAmount: parseFloat(formData.discountAmount),
      minimumAmount: parseFloat(formData.minimumAmount),
      maximumDiscount: parseFloat(formData.maximumDiscount),
      usageLimit: parseInt(formData.usageLimit)
    };
    
    setLoading(true);
    
    try {
      let response;
      if (editingId) {
        response = await couponsAPI.updateCoupon(editingId, couponData);
        toast.success('Cập nhật mã giảm giá thành công');
      } else {
        response = await couponsAPI.createCoupon(couponData);
        toast.success('Tạo mã giảm giá thành công');
      }
      
      // Làm mới danh sách mã giảm giá
      fetchCoupons();
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setFormData({
      ...coupon,
      startDate: new Date(coupon.startDate).toISOString().substring(0, 16),
      endDate: new Date(coupon.endDate).toISOString().substring(0, 16),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      return;
    }
    
    setLoading(true);
    try {
      await couponsAPI.deleteCoupon(id);
      toast.success('Xóa mã giảm giá thành công');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Có lỗi xảy ra khi xóa mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountAmount: 10,
      minimumAmount: 0,
      maximumDiscount: 0,
      startDate: new Date().toISOString().substring(0, 16),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().substring(0, 16),
      isActive: true,
      usageLimit: 100,
      description: ''
    });
    setEditingId(null);
  };

  const openSendDialog = (coupon) => {
    setCouponForSending(coupon);
    setShowSendDialog(true);
    fetchUsers();
  };

  const handleSendCoupon = async () => {
    if (!couponForSending || selectedUsers.length === 0) {
      toast.error('Vui lòng chọn mã giảm giá và người nhận');
      return;
    }
    
    setSendingCoupon(true);
    try {
      // Gọi API gửi mã giảm giá đến người dùng
      const response = await couponsAPI.sendCouponToUsers(couponForSending._id, selectedUsers);
      
      if (response.data.success) {
        toast.success(`Đã gửi mã giảm giá ${couponForSending.code} đến ${selectedUsers.length} người dùng`);
        setShowSendDialog(false);
        setSelectedUsers([]);
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi gửi mã giảm giá');
      }
    } catch (error) {
      console.error('Error sending coupon:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi mã giảm giá');
    } finally {
      setSendingCoupon(false);
    }
  };

  const handleGenerateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGenerateFormData({
      ...generateFormData,
      [name]: type === 'checkbox' ? checked : 
              name === 'count' || name === 'discountAmount' || name === 'minimumAmount' || 
              name === 'maximumDiscount' || name === 'usageLimit' ? 
              parseFloat(value) : value
    });
  };

  const handleGenerateCoupons = async (e) => {
    e.preventDefault();
    
    setGeneratingCoupon(true);
    
    try {
      // Chuyển đổi ngày tháng cho phù hợp
      const couponData = {
        ...generateFormData,
        startDate: new Date(generateFormData.startDate).toISOString(),
        endDate: new Date(generateFormData.endDate).toISOString()
      };
      
      const response = await couponsAPI.generateRandomCoupon(couponData);
      
      if (response.data.success) {
        toast.success(response.data.message || `Đã tạo ${generateFormData.count} mã giảm giá ngẫu nhiên`);
        fetchCoupons();
        setShowGenerateDialog(false);
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi tạo mã giảm giá');
      }
    } catch (error) {
      console.error('Error generating coupons:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo mã giảm giá');
    } finally {
      setGeneratingCoupon(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-4">
        {loading && <LoadingOverlay />}
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faTicket} className="mr-2 text-indigo-600" />
              Quản lý mã giảm giá
            </h1>
            <p className="mt-1 text-sm text-gray-600">Tạo và quản lý các mã giảm giá cho khách hàng</p>
          </div>
          
          <button 
            onClick={() => setShowGenerateDialog(true)}
            className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
          >
            <FontAwesomeIcon icon={faMagic} className="mr-2" />
            Tạo mã ngẫu nhiên
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Tạo mới
              </button>
            )}
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảm giá</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faTicket} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ví dụ: SUMMER2023"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {formData.discountType === 'percentage' ? 
                        <FontAwesomeIcon icon={faPercent} className="text-gray-400" /> : 
                        <FontAwesomeIcon icon={faCoins} className="text-gray-400" />
                      }
                    </div>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faSort} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.discountType === 'percentage' ? 'Phần trăm giảm giá (%)' : 'Số tiền giảm'}
                  </label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    step={formData.discountType === 'percentage' ? "1" : "1000"}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị đơn hàng tối thiểu</label>
                  <input
                    type="number"
                    name="minimumAmount"
                    value={formData.minimumAmount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    step="1000"
                  />
                </div>
                
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá tối đa</label>
                    <input
                      type="number"
                      name="maximumDiscount"
                      value={formData.maximumDiscount}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                      step="1000"
                      placeholder="0 = không giới hạn"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    placeholder="0 = không giới hạn"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                    />
                    <span>Kích hoạt mã giảm giá</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="2"
                  placeholder="Mô tả chi tiết về mã giảm giá"
                ></textarea>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FontAwesomeIcon icon={editingId ? faEdit : faPlus} className="mr-2" />
                  )}
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Danh sách mã giảm giá */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faTicket} className="mr-2 text-indigo-600" />
              Danh sách mã giảm giá ({coupons.length})
            </h2>
          </div>
          
          {coupons.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faTicket} className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">Chưa có mã giảm giá nào</h3>
              <p className="text-gray-500 mb-4">Tạo mã giảm giá đầu tiên để thu hút khách hàng</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiệu lực</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới hạn</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faTicket} className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{coupon.description || 'Không có mô tả'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.discountType === 'percentage' ? (
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full font-medium">
                              {coupon.discountAmount}%
                            </span>
                            {coupon.maximumDiscount > 0 && (
                              <span className="ml-2 text-xs text-gray-500">
                                tối đa {coupon.maximumDiscount.toLocaleString()}₫
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                            {coupon.discountAmount.toLocaleString()}₫
                          </span>
                        )}
                        {coupon.minimumAmount > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Đơn tối thiểu: {coupon.minimumAmount.toLocaleString()}₫
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400 mr-1.5 text-xs" />
                            {new Date(coupon.startDate).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="flex items-center mt-1">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400 mr-1.5 text-xs" />
                            {new Date(coupon.endDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.usageLimit > 0 ? `${coupon.usageLimit} lần` : 'Không giới hạn'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.isActive ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <FontAwesomeIcon icon={faCheck} className="mr-1" /> Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <FontAwesomeIcon icon={faTimes} className="mr-1" /> Vô hiệu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
                            title="Chỉnh sửa mã"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => openSendDialog(coupon)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50"
                            title="Gửi mã cho khách hàng"
                          >
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                            title="Xóa mã"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Modal gửi mã giảm giá */}
        {showSendDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-green-600 mr-2" />
                  Gửi mã giảm giá: <span className="ml-1 text-indigo-600">{couponForSending?.code}</span>
                </h3>
                <button 
                  onClick={() => {
                    setShowSendDialog(false);
                    setSelectedUsers([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
              
              <div className="px-6 py-4">
                {loadingUsers ? (
                  <div className="flex justify-center py-8">
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Chọn người dùng:</h4>
                        <div className="text-xs text-gray-500">Đã chọn: {selectedUsers.length}/{users.length}</div>
                      </div>
                      {users.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                          Không có người dùng nào trong hệ thống
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
                          {users.map(user => (
                            <div key={user._id} className="flex items-center p-3 hover:bg-gray-50 transition-colors">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mr-3">
                                <FontAwesomeIcon icon={faUser} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <label htmlFor={`user-${user._id}`} className="flex items-center justify-between cursor-pointer">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                  </div>
                                  <input
                                    type="checkbox"
                                    id={`user-${user._id}`}
                                    value={user._id}
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedUsers([...selectedUsers, user._id]);
                                      } else {
                                        setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                                      }
                                    }}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Khách hàng sẽ nhận được thông báo về mã giảm giá này qua email
                    </div>
                  </>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSendDialog(false);
                    setSelectedUsers([]);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSendCoupon}
                  disabled={sendingCoupon || selectedUsers.length === 0}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    sendingCoupon || selectedUsers.length === 0
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {sendingCoupon ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      Gửi mã giảm giá
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal tạo mã giảm giá ngẫu nhiên */}
        {showGenerateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FontAwesomeIcon icon={faMagic} className="text-green-600 mr-2" />
                  Tạo mã giảm giá ngẫu nhiên
                </h3>
                <button 
                  onClick={() => setShowGenerateDialog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
              
              <div className="px-6 py-4">
                <form onSubmit={handleGenerateCoupons} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiền tố mã</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faTicket} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="prefix"
                          value={generateFormData.prefix}
                          onChange={handleGenerateChange}
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Ví dụ: SALE"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                      <input
                        type="number"
                        name="count"
                        value={generateFormData.count}
                        onChange={handleGenerateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        min="1"
                        max="50"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {generateFormData.discountType === 'percentage' ? 
                            <FontAwesomeIcon icon={faPercent} className="text-gray-400" /> : 
                            <FontAwesomeIcon icon={faCoins} className="text-gray-400" />
                          }
                        </div>
                        <select
                          name="discountType"
                          value={generateFormData.discountType}
                          onChange={handleGenerateChange}
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          <option value="percentage">Phần trăm (%)</option>
                          <option value="fixed">Số tiền cố định</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faSort} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {generateFormData.discountType === 'percentage' ? 'Phần trăm giảm giá (%)' : 'Số tiền giảm'}
                      </label>
                      <input
                        type="number"
                        name="discountAmount"
                        value={generateFormData.discountAmount}
                        onChange={handleGenerateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        min="0"
                        step={generateFormData.discountType === 'percentage' ? "1" : "1000"}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        name="description"
                        value={generateFormData.description}
                        onChange={handleGenerateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows="2"
                        placeholder="Mô tả chi tiết về mã giảm giá"
                      ></textarea>
                    </div>
                  </div>
                  
                  <details className="mt-2">
                    <summary className="text-sm text-indigo-600 cursor-pointer font-medium">Tùy chọn nâng cao</summary>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị đơn hàng tối thiểu</label>
                        <input
                          type="number"
                          name="minimumAmount"
                          value={generateFormData.minimumAmount}
                          onChange={handleGenerateChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          step="1000"
                        />
                      </div>
                      
                      {generateFormData.discountType === 'percentage' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá tối đa</label>
                          <input
                            type="number"
                            name="maximumDiscount"
                            value={generateFormData.maximumDiscount}
                            onChange={handleGenerateChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            min="0"
                            step="1000"
                            placeholder="0 = không giới hạn"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                          </div>
                          <input
                            type="datetime-local"
                            name="startDate"
                            value={generateFormData.startDate}
                            onChange={handleGenerateChange}
                            className="w-full border border-gray-300 rounded-lg pl-10 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                          </div>
                          <input
                            type="datetime-local"
                            name="endDate"
                            value={generateFormData.endDate}
                            onChange={handleGenerateChange}
                            className="w-full border border-gray-300 rounded-lg pl-10 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng</label>
                        <input
                          type="number"
                          name="usageLimit"
                          value={generateFormData.usageLimit}
                          onChange={handleGenerateChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="1"
                          placeholder="Số lần sử dụng cho mỗi mã"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={generateFormData.isActive}
                            onChange={handleGenerateChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                          />
                          <span>Kích hoạt mã giảm giá</span>
                        </label>
                      </div>
                    </div>
                  </details>
                
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowGenerateDialog(false)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={generatingCoupon}
                      className={`px-4 py-2 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        generatingCoupon ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {generatingCoupon ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faMagic} className="mr-2" />
                          Tạo mã giảm giá
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CouponManagementPage; 