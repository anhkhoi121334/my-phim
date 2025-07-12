/**
 * Validators cho các API liên quan đến người dùng
 */
import { body, param } from 'express-validator';
import { validate } from './validate';
import mongoose from 'mongoose';

/**
 * Kiểm tra ObjectId có hợp lệ không
 */
const isValidObjectId = (value: string) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('ID không hợp lệ');
  }
  return true;
};

/**
 * Validator cho API lấy thông tin người dùng theo ID
 */
export const getUserByIdValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  
  validate
];

/**
 * Validator cho API cập nhật thông tin người dùng (dành cho admin)
 */
export const updateUserValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Tên phải từ 2-50 ký tự'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Email không hợp lệ'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Vai trò phải là user hoặc admin'),
  
  validate
];

/**
 * Validator cho API cập nhật avatar người dùng
 */
export const updateAvatarValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  
  body('avatar')
    .notEmpty().withMessage('URL hoặc dữ liệu ảnh đại diện là bắt buộc')
    .isURL().withMessage('Avatar phải là URL hợp lệ'),
  
  validate
];

/**
 * Validator cho API xóa người dùng
 */
export const deleteUserValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  
  validate
];

/**
 * Validator cho API thêm địa chỉ người dùng
 */
export const addAddressValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  
  body('fullName')
    .notEmpty().withMessage('Tên đầy đủ là bắt buộc')
    .isLength({ min: 2, max: 50 }).withMessage('Tên đầy đủ phải từ 2-50 ký tự'),
  
  body('phone')
    .notEmpty().withMessage('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  
  body('province')
    .notEmpty().withMessage('Tỉnh/Thành phố là bắt buộc'),
  
  body('district')
    .notEmpty().withMessage('Quận/Huyện là bắt buộc'),
  
  body('ward')
    .notEmpty().withMessage('Phường/Xã là bắt buộc'),
  
  body('street')
    .notEmpty().withMessage('Địa chỉ chi tiết là bắt buộc'),
  
  validate
];

/**
 * Validator cho API cập nhật địa chỉ người dùng
 */
export const updateAddressValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  param('addressId').custom(isValidObjectId).withMessage('ID địa chỉ không hợp lệ'),
  
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Tên đầy đủ phải từ 2-50 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  
  validate
];

/**
 * Validator cho API xóa địa chỉ người dùng
 */
export const deleteAddressValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  param('addressId').custom(isValidObjectId).withMessage('ID địa chỉ không hợp lệ'),
  
  validate
];

/**
 * Validator cho API đặt địa chỉ mặc định
 */
export const setDefaultAddressValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  param('addressId').custom(isValidObjectId).withMessage('ID địa chỉ không hợp lệ'),
  
  validate
];

/**
 * Validator cho API thêm vào danh sách yêu thích
 */
export const addToWishlistValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  
  body('productId')
    .notEmpty().withMessage('ID sản phẩm là bắt buộc')
    .custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  validate
];

/**
 * Validator cho API xóa khỏi danh sách yêu thích
 */
export const removeFromWishlistValidator = [
  param('id').custom(isValidObjectId).withMessage('ID người dùng không hợp lệ'),
  param('productId').custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  validate
]; 