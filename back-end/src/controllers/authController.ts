import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.registerUser(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: userData
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.loginUser(req.body);
    
    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: userData
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateUserProfile(req.user._id, req.body);
    
    return res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update user avatar
// @route   PUT /api/auth/avatar
// @access  Private
export const updateAvatar = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateUserAvatar(req.user._id, req.body.avatar);
    
    return res.json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.updateUserPassword(req.user._id, req.body);
    
    return res.json({
      success: true,
      message: 'Cập nhật mật khẩu thành công',
      data: userData
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get user addresses
// @route   GET /api/auth/addresses
// @access  Private
export const getMyAddresses = async (req: any, res: Response, next: NextFunction) => {
  try {
    const addresses = await authService.getUserAddresses(req.user._id);
    
    return res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Add user address
// @route   POST /api/auth/addresses
// @access  Private
export const addMyAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    const newAddress = await authService.addUserAddress(req.user._id, req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: newAddress
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update user address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
export const updateMyAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    const updatedAddress = await authService.updateUserAddress(req.user._id, req.params.addressId, req.body);
    
    return res.json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: updatedAddress
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete user address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
export const deleteMyAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    await authService.deleteUserAddress(req.user._id, req.params.addressId);
    
    return res.json({
      success: true,
      message: 'Xóa địa chỉ thành công',
      data: {}
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Set default address
// @route   PUT /api/auth/addresses/:addressId/default
// @access  Private
export const setMyDefaultAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    const defaultAddress = await authService.setDefaultAddress(req.user._id, req.params.addressId);
    
    return res.json({
      success: true,
      message: 'Đặt địa chỉ mặc định thành công',
      data: defaultAddress
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
export const getMyWishlist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const wishlist = await authService.getUserWishlist(req.user._id);
    
    return res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/auth/wishlist
// @access  Private
export const addToMyWishlist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await authService.addToWishlist(req.user._id, req.body.productId);
    
    return res.json({
      success: true,
      message: 'Thêm vào danh sách yêu thích thành công',
      data: user.wishlist
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/auth/wishlist/:productId
// @access  Private
export const removeFromMyWishlist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await authService.removeFromWishlist(req.user._id, req.params.productId);
    
    return res.json({
      success: true,
      message: 'Xóa khỏi danh sách yêu thích thành công',
      data: user.wishlist
    });
  } catch (error) {
    return next(error);
  }
}; 