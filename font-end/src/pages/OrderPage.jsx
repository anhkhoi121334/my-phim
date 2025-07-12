import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { ordersAPI, couponsAPI, authAPI, paymentAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';

const OrderPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "Việt Nam",
  });
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const navigate = useNavigate();

  const itemsPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 1000000 ? 0 : 50000; // Free shipping for orders over 1,000,000₫
  const taxPrice = Math.round(itemsPrice * 0.1); // 10% tax
  
  // Tính toán giảm giá từ mã giảm giá
  const discountAmount = appliedCoupon ? appliedCoupon.appliedDiscount : 0;
  
  // Tính tổng tiền sau khi áp dụng giảm giá
  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

  // Fetch địa chỉ người dùng khi component mount
  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  // Hàm lấy danh sách địa chỉ của người dùng
  const fetchUserAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await authAPI.getAddresses();
      if (response.data.success) {
        setUserAddresses(response.data.data || []);
        
        // Tìm địa chỉ mặc định
        const defaultAddress = response.data.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          // Điền thông tin từ địa chỉ mặc định
          updateFormFromAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Cập nhật form từ địa chỉ được chọn
  const updateFormFromAddress = (address) => {
    setFormData({
      address: address.address + (address.ward ? `, ${address.ward}` : '') + (address.district ? `, ${address.district}` : ''),
      city: address.city,
      postalCode: address.postalCode || '',
      country: address.country || 'Việt Nam',
    });
  };

  // Xử lý khi chọn địa chỉ
  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = userAddresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      updateFormFromAddress(selectedAddress);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
    // Reset coupon error when user types
    if (couponError) setCouponError("");
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá");
      return;
    }
    
    setCouponLoading(true);
    setCouponError("");
    
    try {
      const response = await couponsAPI.validateCoupon(couponCode, itemsPrice);
      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        toast.success("Áp dụng mã giảm giá thành công!");
      }
    } catch (error) {
      console.error("Coupon error:", error);
      setCouponError(error.response?.data?.message || "Mã giảm giá không hợp lệ");
      toast.error(error.response?.data?.message || "Mã giảm giá không hợp lệ");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Đã xóa mã giảm giá");
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ["address", "city", "postalCode"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Vui lòng nhập ${field === "address" ? "địa chỉ" : field === "city" ? "thành phố" : "mã bưu điện"}!`);
        return;
      }
    }

    // Kiểm tra xem có sản phẩm nào trong giỏ hàng không có giá hoặc không có ID hợp lệ
    const invalidItems = cart.filter(item => 
      item.price === undefined || 
      item.price === null || 
      !item._id || 
      item._id === ""
    );
    
    if (invalidItems.length > 0) {
      toast.error(`Có ${invalidItems.length} sản phẩm trong giỏ hàng không hợp lệ. Vui lòng xóa và thêm lại.`);
      console.error("Invalid items:", invalidItems);
      return;
    }

    setLoading(true);
    try {
      // Lọc bỏ sản phẩm không có ID và format dữ liệu
      const validItems = cart.filter(item => item._id && item._id.trim() !== "");
      
      if (validItems.length === 0) {
        toast.error("Không có sản phẩm hợp lệ để đặt hàng");
        setLoading(false);
        return;
      }

      // Format the order data according to the backend model
      const orderData = {
        orderItems: validItems.map((item) => ({
          name: item.name || "Sản phẩm không tên",
          quantity: item.quantity || 1,
          image: item.image || "https://via.placeholder.com/150",
          price: item.price || 0,
          product: item._id,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country || "Vietnam",
        },
        paymentMethod,
        itemsPrice: itemsPrice || 0,
        taxPrice: taxPrice || 0,
        shippingPrice: shippingPrice || 0,
        totalPrice: totalPrice || 0,
        discountAmount: discountAmount || 0,
        ...(appliedCoupon && { couponCode: appliedCoupon.code }),
      };

      console.log("Sending order data:", JSON.stringify(orderData));

      // Nếu có mã giảm giá, áp dụng trên server
      if (appliedCoupon) {
        await couponsAPI.applyCoupon(appliedCoupon.code);
      }

      const orderRes = await ordersAPI.createOrder(orderData);
      const createdOrder = orderRes.data.data;
      if (paymentMethod === 'MoMo') {
        try {
          // Gọi API tạo thanh toán MoMo
          const momoRes = await paymentAPI.createMomoPayment(createdOrder._id);
          console.log("MoMo payment data:", momoRes);
          
          // Đảm bảo lấy đúng payUrl từ response
          if (momoRes && momoRes.payUrl) {
            // Lưu orderId trước khi chuyển hướng để có thể quay lại trang chi tiết đơn hàng
            localStorage.setItem('lastOrderId', createdOrder._id);
            window.location.href = momoRes.payUrl;
          } else {
            toast.error("Không lấy được link thanh toán MoMo. Vui lòng thử lại!");
            navigate(`/order/${createdOrder._id}`);
          }
        } catch (err) {
          console.error("MoMo payment error:", err);
          toast.error(err.response?.data?.message || "Lỗi khi tạo thanh toán MoMo");
          navigate(`/order/${createdOrder._id}`);
        }
        return;
      }
      if (paymentMethod === 'QuickPay') {
        // Gọi API tạo thanh toán Quick Pay (POS)
        // Ở đây cần paymentCode, bạn có thể lấy từ input hoặc test hardcode
        const paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        try {
          const quickPayRes = await paymentAPI.createMomoQuickPay({
            amount: createdOrder.totalPrice,
            paymentCode,
            orderInfo: `Thanh toán đơn hàng #${createdOrder._id}`
          });
          if (quickPayRes.data && quickPayRes.data.data && quickPayRes.data.data.resultCode === 0) {
            toast.success("Tạo thanh toán Quick Pay thành công!");
            // Có thể redirect hoặc hiển thị thông tin thanh toán ở đây
          } else {
            toast.error(quickPayRes.data?.data?.message || "Thanh toán Quick Pay thất bại!");
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Thanh toán Quick Pay thất bại!");
        }
        return;
      }
      clearCart();
      toast.success("Đặt hàng thành công!");
      navigate("/products");
    } catch (err) {
      console.error("Order error:", err);
      console.error("Request data:", err.config?.data);
      console.error("Response:", err.response?.data);
      toast.error(err.response?.data?.message || "Đặt hàng thất bại! Vui lòng kiểm tra thông tin đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "40vh" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty cart"
          className="w-28 h-28 mb-4 opacity-70"
        />
        <h2 className="text-2xl font-bold mb-2 text-slate-700">Giỏ hàng trống</h2>
        <Link
          to="/products"
          className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Xem sản phẩm
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
          
          {/* Danh sách địa chỉ đã lưu */}
          {user && (
            <div className="mb-6">
              <h4 className="font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-indigo-600" />
                Địa chỉ đã lưu
              </h4>
              
              {loadingAddresses ? (
                <div className="flex justify-center py-4">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-indigo-600 text-2xl" />
                </div>
              ) : userAddresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {userAddresses.map(address => (
                    <div 
                      key={address._id}
                      onClick={() => handleSelectAddress(address._id)}
                      className={`border rounded-lg p-3 cursor-pointer transition hover:border-indigo-400 ${
                        selectedAddressId === address._id 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h5 className="font-medium text-sm">{address.name}</h5>
                        {address.isDefault && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{address.phone}</p>
                      <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                        {address.address}
                        {address.ward && `, ${address.ward}`}
                        {address.district && `, ${address.district}`}
                        {address.city && `, ${address.city}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                  Bạn chưa có địa chỉ nào. Thêm địa chỉ trong trang "Tài khoản".
                </div>
              )}
              
              <div className="mt-2">
                <Link 
                  to="/account" 
                  className="text-indigo-600 text-sm flex items-center hover:text-indigo-800"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Thêm địa chỉ mới
                </Link>
              </div>
            </div>
          )}
          
          <form onSubmit={handleOrder} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Địa chỉ <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="address"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, phường/xã"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Thành phố <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="city"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.city}
                onChange={handleChange}
                placeholder="Thành phố/Tỉnh"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Mã bưu điện <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="postalCode"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Mã bưu điện"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Quốc gia</label>
              <input
                type="text"
                name="country"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.country}
                onChange={handleChange}
                placeholder="Quốc gia"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Phương thức thanh toán <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                required
              >
                <option value="Cash on Delivery">Thanh toán khi nhận hàng</option>
                <option value="MoMo">Thanh toán MoMo</option>
                <option value="QuickPay">Thanh toán MoMo Quick Pay (POS)</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
          
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h4 className="font-medium mb-2">Sản phẩm ({cart.length})</h4>
            {cart.map((item) => (
              <div key={`${item._id}-${item.variant?.id || 'default'}`} className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                    <img 
                      src={item.image || "https://via.placeholder.com/50"} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</span>
              </div>
            ))}
          </div>
          
          {/* Coupon Form */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Mã giảm giá</h4>
            
            {/* Show this when no coupon is applied */}
            {!appliedCoupon && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  className={`flex-1 border ${couponError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={handleCouponChange}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50"
                >
                  {couponLoading ? "Đang áp dụng..." : "Áp dụng"}
                </button>
              </div>
            )}
            
            {/* Show this when coupon is applied */}
            {appliedCoupon && (
              <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-indigo-600">{appliedCoupon.code}</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                      {appliedCoupon.discountType === 'percentage' 
                        ? `Giảm ${appliedCoupon.discountAmount}%` 
                        : `Giảm ${appliedCoupon.discountAmount.toLocaleString()}₫`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{appliedCoupon.description}</p>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            
            {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{itemsPrice.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingPrice === 0 ? "Miễn phí" : shippingPrice.toLocaleString() + "₫"}</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế (10%):</span>
              <span>{taxPrice.toLocaleString()}₫</span>
            </div>
            
            {/* Show discount amount if coupon is applied */}
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{discountAmount.toLocaleString()}₫</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
              <span>Tổng cộng:</span>
              <span className="text-indigo-600">{totalPrice.toLocaleString()}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage; 