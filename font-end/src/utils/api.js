import axios from 'axios';

// LƯU Ý: Sửa URL kết nối đến backend
const API_URL = 'http://localhost:5001/api';

console.log("⚠️ API URL được cấu hình tại:", API_URL);

// Utility functions for banner APIs
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log('Including auth token in request');
  } else {
    console.warn('No auth token found in localStorage');
  }
  
  return headers;
};

const handleResponse = async (response) => {
  console.log('API Response:', response.url, response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error Response:', response.url, response.status, errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable sending cookies with requests
  timeout: 15000, // Timeout sau 15 giây
});

// Thêm retry logic
api.interceptors.response.use(undefined, async (err) => {
  const { config, message } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }
  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;
  
  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }
  
  // Increase the retry count
  config.__retryCount += 1;
  
  // Create new promise to handle exponential backoff
  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Retry #${config.__retryCount} for ${config.url}`);
      resolve();
    }, config.retryDelay || 1000);
  });
  
  // Return the promise in which recalls axios to retry the request
  await backoff;
  return api(config);
});

// Thêm retry và retryDelay vào mọi request
api.defaults.retry = 2; // Số lần retry
api.defaults.retryDelay = 1000; // Delay giữa các lần retry (ms)

// Thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API request để debug
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// API Xác thực
export const authAPI = {
  // Đăng ký tài khoản
  register: (userData) => api.post('/auth/register', userData),
  
  // Đăng nhập
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Lấy thông tin người dùng
  getProfile: () => api.get('/auth/me'),
  
  // Cập nhật thông tin người dùng
  updateProfile: (userData) => api.put('/auth/me', userData),
  
  // Cập nhật mật khẩu
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
  
  // Cập nhật ảnh đại diện
  updateAvatar: (avatarData) => api.put('/auth/avatar', avatarData),

  // Quản lý địa chỉ
  getAddresses: () => api.get('/auth/addresses'),
  
  addAddress: (addressData) => api.post('/auth/addresses', addressData),
  
  updateAddress: (addressId, addressData) => api.put(`/auth/addresses/${addressId}`, addressData),
  
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`),
  
  setDefaultAddress: (addressId) => api.put(`/auth/addresses/${addressId}/default`),
  
  // Quản lý wishlist
  getWishlist: () => api.get('/auth/wishlist'),
  
  addToWishlist: (productId) => api.post('/auth/wishlist', { productId }),
  
  removeFromWishlist: (productId) => api.delete(`/auth/wishlist/${productId}`),
};

// API Sản phẩm
export const productsAPI = {
  // Lấy danh sách sản phẩm với bộ lọc
  getProducts: (params) => api.get('/products', { params }),
  
  // Lấy chi tiết sản phẩm
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Lấy biến thể sản phẩm theo SKU
  getVariant: (sku) => api.get(`/products/variant/${sku}`),
  
  // Lấy sản phẩm nổi bật
  getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),
  
  // Lấy danh sách thương hiệu
  getBrands: () => api.get('/products/brands'),
  
  // Admin: Tạo sản phẩm mới
  createProduct: (productData) => api.post('/products', productData),
  
  // Admin: Cập nhật sản phẩm
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Admin: Xóa sản phẩm
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Admin: Xóa tất cả sản phẩm
  deleteAllProducts: () => api.delete('/products/delete-all'),
};

// API Danh mục
export const categoriesAPI = {
  // Lấy tất cả danh mục
  getCategories: () => api.get('/categories'),
  
  // Lấy cây danh mục
  getCategoryTree: () => api.get('/categories/tree'),
  
  // Lấy chi tiết danh mục
  getCategory: (id) => api.get(`/categories/${id}`),
  
  // Lấy danh mục theo slug
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  
  // Admin: Tạo danh mục mới
  createCategory: (categoryData) => api.post('/categories', categoryData),
  
  // Admin: Cập nhật danh mục
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  // Admin: Xóa danh mục
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  
  // Admin: Xóa tất cả danh mục
  deleteAllCategories: () => api.delete('/categories/delete-all'),
  
  // Lấy thống kê danh mục
  getCategoryStats: () => api.get('/categories/stats'),
};

// API Đơn hàng
export const ordersAPI = {
  // Tạo đơn hàng mới
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // Lấy đơn hàng của người dùng
  getMyOrders: () => api.get('/orders/myorders'),
  
  // Lấy chi tiết đơn hàng
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Cập nhật trạng thái thanh toán
  updateOrderToPaid: (id, paymentResult) => api.put(`/orders/${id}/pay`, paymentResult),
  
  // Admin: Lấy tất cả đơn hàng
  getAllOrders: () => api.get('/orders'),
  
  // Admin: Cập nhật trạng thái giao hàng
  updateOrderToDelivered: (id) => api.put(`/orders/${id}/deliver`),
};

// API Mã giảm giá (Coupon)
export const couponsAPI = {
  // Validate mã giảm giá
  validateCoupon: (code, amount) => api.post('/coupons/validate', { code, amount }),
  
  // Áp dụng mã giảm giá
  applyCoupon: (code) => api.post('/coupons/apply', { code }),
  
  // Admin: Lấy tất cả mã giảm giá
  getCoupons: () => api.get('/coupons'),
  
  // Admin: Lấy chi tiết mã giảm giá
  getCoupon: (id) => api.get(`/coupons/${id}`),
  
  // Admin: Tạo mã giảm giá mới
  createCoupon: (couponData) => api.post('/coupons', couponData),
  
  // Admin: Cập nhật mã giảm giá
  updateCoupon: (id, couponData) => api.put(`/coupons/${id}`, couponData),
  
  // Admin: Xóa mã giảm giá
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  
  // Admin: Gửi mã giảm giá cho người dùng
  sendCouponToUsers: (couponId, userIds) => api.post('/coupons/send', { couponId, userIds }),
  
  // Admin: Tạo mã giảm giá ngẫu nhiên
  generateRandomCoupon: (options) => api.post('/coupons/generate', options),
  
  // Lấy mã giảm giá của người dùng hiện tại
  getMyCoupons: () => api.get('/coupons/mycoupons')
};

// API User (admin)
export const usersAPI = {
  // Admin: Lấy tất cả user
  getAllUsers: () => api.get('/users'),
  
  // Admin: Lấy thông tin user theo ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Admin: Cập nhật thông tin user
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Admin: Cập nhật avatar của user
  updateUserAvatar: (id, avatarData) => api.put(`/users/${id}/avatar`, avatarData),
  
  // Admin: Xóa user
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Admin: Quản lý địa chỉ của user
  getUserAddresses: (userId) => api.get(`/users/${userId}/addresses`),
  
  addUserAddress: (userId, addressData) => api.post(`/users/${userId}/addresses`, addressData),
  
  updateUserAddress: (userId, addressId, addressData) => 
    api.put(`/users/${userId}/addresses/${addressId}`, addressData),
  
  deleteUserAddress: (userId, addressId) => 
    api.delete(`/users/${userId}/addresses/${addressId}`),
  
  setUserDefaultAddress: (userId, addressId) => 
    api.put(`/users/${userId}/addresses/${addressId}/default`),
    
  // Admin: Quản lý wishlist của user
  getUserWishlist: (userId) => api.get(`/users/${userId}/wishlist`),
  
  addToUserWishlist: (userId, productId) => 
    api.post(`/users/${userId}/wishlist`, { productId }),
  
  removeFromUserWishlist: (userId, productId) => 
    api.delete(`/users/${userId}/wishlist/${productId}`),
};

// API Thanh toán
export const paymentAPI = {
  // Tạo thanh toán MoMo
  createMomoPayment: async (orderId) => {
    const response = await api.post('/payment/momo/create', { orderId });
    console.log('MoMo response:', response.data);

    if (!response.data.data?.payUrl) {
      throw new Error(response.data.message || 'Không lấy được link thanh toán MoMo');
    }

    return response.data.data; // trả về cả object để lấy orderId, orderCode nếu cần
  },

  // Tạo thanh toán MoMo Quick Pay (POS)
  createMomoQuickPay: async (data) => {
    const response = await api.post('/payment/momo/quickpay', data);
    console.log('MoMo Quick Pay response:', response.data);
    return response.data;
  }
};

// Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error);
    
    // Lấy message từ response nếu có
    const message = error.response?.data?.message || 'Đã có lỗi xảy ra';
    
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Chỉ chuyển hướng nếu không phải đang ở trang login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Banner APIs
export const bannersAPI = {
  // Lấy tất cả banners với bộ lọc
  getBanners: (filters = {}) => api.get('/banners', { params: filters }),
  
  // Lấy banners theo position
  getBannersByPosition: (position) => {
    console.log('getBannersByPosition called with API URL:', API_URL);
    console.log('Current axios baseURL:', api.defaults.baseURL);
    return api.get(`/banners/position/${position}`);
  },
  
  // Lấy chi tiết banner
  getBanner: (id) => api.get(`/banners/${id}`),
  
  // Admin: Tạo banner mới
  createBanner: (bannerData) => api.post('/banners', bannerData),
  
  // Admin: Cập nhật banner
  updateBanner: (id, bannerData) => api.put(`/banners/${id}`, bannerData),
  
  // Admin: Xóa banner
  deleteBanner: (id) => api.delete(`/banners/${id}`),
  
  // Admin: Sắp xếp lại thứ tự banners
  reorderBanners: (banners) => api.put('/banners/reorder', { banners }),
  
  // Admin: Toggle trạng thái banner
  toggleBannerStatus: (id) => api.patch(`/banners/${id}/toggle-status`),
  
  // Admin: Tạo banner ngẫu nhiên
  createRandomBanner: () => api.post('/banners/random'),
};