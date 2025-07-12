import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    
    return res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user by admin
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUserByAdmin(req.params.id, req.body);
    
    return res.json({
      success: true,
      message: 'Cập nhật thông tin người dùng thành công',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/:id/avatar
// @access  Private/Admin
export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUserAvatar(req.params.id, req.body.avatar);
    
    return res.json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id);
    
    return res.json({
      success: true,
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user addresses
// @route   GET /api/users/:id/addresses
// @access  Private
export const getUserAddresses = async (req: any, res: Response, next: NextFunction) => {
  try {
    const addresses = await userService.getUserAddresses(
      req.params.id,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add address to user
// @route   POST /api/users/:id/addresses
// @access  Private
export const addUserAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    const newAddress = await userService.addUserAddress(
      req.params.id,
      req.body,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: newAddress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user address
// @route   PUT /api/users/:id/addresses/:addressId
// @access  Private
export const updateUserAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    const updatedAddress = await userService.updateUserAddress(
      req.params.id,
      req.params.addressId,
      req.body,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: updatedAddress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/:id/addresses/:addressId
// @access  Private
export const deleteUserAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUserAddress(
      req.params.id,
      req.params.addressId,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.json({
      success: true,
      message: 'Xóa địa chỉ thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default address
// @route   PUT /api/users/:id/addresses/:addressId/default
// @access  Private
export const setDefaultAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    const defaultAddress = await userService.setDefaultAddress(
      req.params.id,
      req.params.addressId,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.json({
      success: true,
      message: 'Đặt địa chỉ mặc định thành công',
      data: defaultAddress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/:id/wishlist
// @access  Private
export const getWishlist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const wishlist = await userService.getUserWishlist(
      req.params.id,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/users/:id/wishlist
// @access  Private
export const addToWishlist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await userService.addToWishlist(
      req.params.id,
      req.body.productId,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.json({
      success: true,
      message: 'Thêm vào danh sách yêu thích thành công',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/users/:id/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await userService.removeFromWishlist(
      req.params.id,
      req.params.productId,
      req.user._id.toString(),
      req.user.role === 'admin'
    );
    
    return res.json({
      success: true,
      message: 'Xóa khỏi danh sách yêu thích thành công',
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
}; 