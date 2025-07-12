/**
 * Validators cho các API liên quan đến xác thực và người dùng
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
 * Validator cho API đăng ký
 */
export const registerValidator = [
  body('name')
    .notEmpty().withMessage('Tên là bắt buộc')
    .isLength({ min: 2, max: 50 }).withMessage('Tên phải từ 2-50 ký tự'),
  
  body('email')
    .notEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ'),
  
  body('password')
    .notEmpty().withMessage('Mật khẩu là bắt buộc')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  
  validate
];

/**
 * Validator cho API đăng nhập
 */
export const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ'),
  
  body('password')
    .notEmpty().withMessage('Mật khẩu là bắt buộc'),
  
  validate
];

/**
 * Validator cho API cập nhật thông tin người dùng
 */
export const updateProfileValidator = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Tên phải từ 2-50 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  
  validate
];

/**
 * Validator cho API cập nhật avatar
 */
export const updateAvatarValidator = [
  body('avatar')
    .notEmpty().withMessage('URL hoặc dữ liệu ảnh đại diện là bắt buộc')
    .isURL().withMessage('Avatar phải là URL hợp lệ'),
  
  validate
];

/**
 * Validator cho API cập nhật mật khẩu
 */
export const updatePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
  
  body('newPassword')
    .notEmpty().withMessage('Mật khẩu mới là bắt buộc')
    .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('Mật khẩu mới phải khác mật khẩu hiện tại');
      }
      return true;
    }),
  
  validate
];

/**
 * Validator cho API thêm địa chỉ mới
 */
export const addAddressValidator = [
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
 * Validator cho API cập nhật địa chỉ
 */
export const updateAddressValidator = [
  param('addressId')
    .custom(isValidObjectId).withMessage('ID địa chỉ không hợp lệ'),
  
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Tên đầy đủ phải từ 2-50 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  
  validate
];

/**
 * Validator cho API xóa địa chỉ
 */
export const deleteAddressValidator = [
  param('addressId')
    .custom(isValidObjectId).withMessage('ID địa chỉ không hợp lệ'),
  
  validate
];

/**
 * Validator cho API đặt địa chỉ mặc định
 */
export const setDefaultAddressValidator = [
  param('addressId')
    .custom(isValidObjectId).withMessage('ID địa chỉ không hợp lệ'),
  
  validate
];

/**
 * Validator cho API thêm vào danh sách yêu thích
 */
export const addToWishlistValidator = [
  body('productId')
    .notEmpty().withMessage('ID sản phẩm là bắt buộc')
    .custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  validate
];

/**
 * Validator cho API xóa khỏi danh sách yêu thích
 */
export const removeFromWishlistValidator = [
  param('productId')
    .custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  validate
]; 