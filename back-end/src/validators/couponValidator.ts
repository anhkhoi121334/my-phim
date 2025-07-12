import { body, param } from 'express-validator';
import { validate } from './validate';

/**
 * Validation for creating a new coupon
 */
export const validateCreateCoupon = validate([
  body('code')
    .notEmpty()
    .withMessage('Mã giảm giá không được để trống')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Mã giảm giá phải có từ 3 đến 20 ký tự'),
  
  body('description')
    .notEmpty()
    .withMessage('Mô tả không được để trống')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Mô tả không được vượt quá 200 ký tự'),
  
  body('discountType')
    .notEmpty()
    .withMessage('Loại giảm giá không được để trống')
    .isIn(['percentage', 'fixed'])
    .withMessage('Loại giảm giá phải là percentage hoặc fixed'),
  
  body('discountAmount')
    .notEmpty()
    .withMessage('Giá trị giảm giá không được để trống')
    .isFloat({ min: 0 })
    .withMessage('Giá trị giảm giá phải là số dương')
    .custom((value, { req }) => {
      if (req.body.discountType === 'percentage' && value > 100) {
        throw new Error('Giá trị giảm giá theo phần trăm không được vượt quá 100%');
      }
      return true;
    }),
  
  body('minimumAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá trị đơn hàng tối thiểu phải là số dương'),
  
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá trị giảm giá tối đa phải là số dương'),
  
  body('startDate')
    .notEmpty()
    .withMessage('Ngày bắt đầu không được để trống')
    .isISO8601()
    .withMessage('Ngày bắt đầu không hợp lệ'),
  
  body('endDate')
    .notEmpty()
    .withMessage('Ngày kết thúc không được để trống')
    .isISO8601()
    .withMessage('Ngày kết thúc không hợp lệ')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      return true;
    }),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái kích hoạt phải là true hoặc false'),
  
  body('usageLimit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Giới hạn sử dụng phải là số nguyên không âm')
]);

/**
 * Validation for getting a coupon by ID
 */
export const validateGetCouponById = validate([
  param('id')
    .isMongoId()
    .withMessage('ID mã giảm giá không hợp lệ')
]);

/**
 * Validation for updating a coupon
 */
export const validateUpdateCoupon = validate([
  param('id')
    .isMongoId()
    .withMessage('ID mã giảm giá không hợp lệ'),
  
  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Mã giảm giá phải có từ 3 đến 20 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Mô tả không được vượt quá 200 ký tự'),
  
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Loại giảm giá phải là percentage hoặc fixed'),
  
  body('discountAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá trị giảm giá phải là số dương')
    .custom((value, { req }) => {
      if (req.body.discountType === 'percentage' && value > 100) {
        throw new Error('Giá trị giảm giá theo phần trăm không được vượt quá 100%');
      }
      return true;
    }),
  
  body('minimumAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá trị đơn hàng tối thiểu phải là số dương'),
  
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá trị giảm giá tối đa phải là số dương'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Ngày bắt đầu không hợp lệ'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Ngày kết thúc không hợp lệ')
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      return true;
    }),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái kích hoạt phải là true hoặc false'),
  
  body('usageLimit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Giới hạn sử dụng phải là số nguyên không âm')
]);

/**
 * Validation for deleting a coupon
 */
export const validateDeleteCoupon = validate([
  param('id')
    .isMongoId()
    .withMessage('ID mã giảm giá không hợp lệ')
]);

/**
 * Validation for validating a coupon
 */
export const validateCouponValidation = validate([
  body('code')
    .notEmpty()
    .withMessage('Mã giảm giá không được để trống')
    .trim(),
  
  body('amount')
    .notEmpty()
    .withMessage('Giá trị đơn hàng không được để trống')
    .isFloat({ min: 0 })
    .withMessage('Giá trị đơn hàng phải là số dương')
]);

/**
 * Validation for applying a coupon
 */
export const validateApplyCoupon = validate([
  body('code')
    .notEmpty()
    .withMessage('Mã giảm giá không được để trống')
    .trim()
]);

/**
 * Validation for sending a coupon to users
 */
export const validateSendCouponToUsers = validate([
  param('id')
    .isMongoId()
    .withMessage('ID mã giảm giá không hợp lệ'),
  
  body('userIds')
    .isArray({ min: 1 })
    .withMessage('Danh sách người dùng không được để trống'),
  
  body('userIds.*')
    .isMongoId()
    .withMessage('ID người dùng không hợp lệ')
]); 