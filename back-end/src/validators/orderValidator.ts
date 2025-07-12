import { body, param } from 'express-validator';
import { validate } from './validate';

/**
 * Validation for creating a new order
 */
export const validateCreateOrder = validate([
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Đơn hàng phải có ít nhất một sản phẩm'),
  
  body('orderItems.*.product')
    .notEmpty()
    .withMessage('ID sản phẩm không được để trống')
    .isMongoId()
    .withMessage('ID sản phẩm không hợp lệ'),
  
  body('orderItems.*.name')
    .notEmpty()
    .withMessage('Tên sản phẩm không được để trống'),
  
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Số lượng sản phẩm phải là số nguyên lớn hơn 0'),
  
  body('orderItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Giá sản phẩm phải là số dương'),
  
  body('shippingAddress')
    .notEmpty()
    .withMessage('Địa chỉ giao hàng không được để trống')
    .isObject()
    .withMessage('Địa chỉ giao hàng phải là một đối tượng'),
  
  body('shippingAddress.address')
    .notEmpty()
    .withMessage('Địa chỉ không được để trống'),
  
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('Thành phố không được để trống'),
  
  body('shippingAddress.postalCode')
    .notEmpty()
    .withMessage('Mã bưu điện không được để trống'),
  
  body('paymentMethod')
    .notEmpty()
    .withMessage('Phương thức thanh toán không được để trống'),
  
  body('itemsPrice')
    .isFloat({ min: 0 })
    .withMessage('Giá sản phẩm phải là số dương'),
  
  body('taxPrice')
    .isFloat({ min: 0 })
    .withMessage('Thuế phải là số dương'),
  
  body('shippingPrice')
    .isFloat({ min: 0 })
    .withMessage('Phí vận chuyển phải là số dương'),
  
  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Tổng tiền phải là số dương'),
  
  body('discountAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giảm giá phải là số dương'),
  
  body('couponCode')
    .optional()
    .isString()
    .withMessage('Mã giảm giá phải là chuỗi')
]);

/**
 * Validation for getting an order by ID
 */
export const validateGetOrderById = validate([
  param('id')
    .isMongoId()
    .withMessage('ID đơn hàng không hợp lệ')
]);

/**
 * Validation for updating order to paid status
 */
export const validateUpdateOrderToPaid = validate([
  param('id')
    .isMongoId()
    .withMessage('ID đơn hàng không hợp lệ'),
  
  body('id')
    .notEmpty()
    .withMessage('ID thanh toán không được để trống'),
  
  body('status')
    .notEmpty()
    .withMessage('Trạng thái thanh toán không được để trống'),
  
  body('update_time')
    .notEmpty()
    .withMessage('Thời gian cập nhật không được để trống'),
  
  body('payer.email_address')
    .notEmpty()
    .withMessage('Email người thanh toán không được để trống')
    .isEmail()
    .withMessage('Email không hợp lệ')
]);

/**
 * Validation for updating order to delivered status
 */
export const validateUpdateOrderToDelivered = validate([
  param('id')
    .isMongoId()
    .withMessage('ID đơn hàng không hợp lệ')
]);

/**
 * Validation for cancelling an order
 */
export const validateCancelOrder = validate([
  param('id')
    .isMongoId()
    .withMessage('ID đơn hàng không hợp lệ')
]); 