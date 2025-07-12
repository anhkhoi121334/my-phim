import { body, param, query } from 'express-validator';
import { validate } from './validate';
import mongoose from 'mongoose';

/**
 * Validation for creating MoMo payment
 */
export const validateCreateMomoPayment = [
  body('orderId')
    .notEmpty()
    .withMessage('ID đơn hàng không được để trống')
    .isMongoId()
    .withMessage('ID đơn hàng không hợp lệ')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('ID đơn hàng không đúng định dạng');
      }
      return true;
    }),
  validate
];

/**
 * Validation for MoMo payment callback
 */
export const validateMomoCallback = [
  query('orderId')
    .notEmpty()
    .withMessage('Mã đơn hàng không được để trống'),
  query('resultCode')
    .notEmpty()
    .withMessage('Mã kết quả không được để trống'),
  validate
];

/**
 * Validation for MoMo IPN (Instant Payment Notification)
 */
export const validateMomoIPN = [
  body('orderId')
    .notEmpty()
    .withMessage('Mã đơn hàng không được để trống'),
  body('resultCode')
    .notEmpty()
    .withMessage('Mã kết quả không được để trống'),
  body('signature')
    .notEmpty()
    .withMessage('Chữ ký không được để trống'),
  validate
];

/**
 * Validation for MoMo Quick Pay
 */
export const validateMomoQuickPay = [
  body('amount')
    .notEmpty()
    .withMessage('Số tiền không được để trống')
    .isInt({ min: 1000 })
    .withMessage('Số tiền phải là số nguyên và tối thiểu 1000 VND'),
  body('paymentCode')
    .notEmpty()
    .withMessage('Mã thanh toán không được để trống')
    .isString()
    .withMessage('Mã thanh toán phải là chuỗi')
    .isLength({ min: 3, max: 100 })
    .withMessage('Mã thanh toán phải có độ dài từ 3 đến 100 ký tự'),
  body('orderInfo')
    .optional()
    .isString()
    .withMessage('Thông tin đơn hàng phải là chuỗi')
    .isLength({ max: 255 })
    .withMessage('Thông tin đơn hàng không được quá 255 ký tự'),
  body('orderGroupId')
    .optional()
    .isString()
    .withMessage('ID nhóm đơn hàng phải là chuỗi'),
  body('autoCapture')
    .optional()
    .isBoolean()
    .withMessage('autoCapture phải là true hoặc false'),
  body('lang')
    .optional()
    .isString()
    .withMessage('Ngôn ngữ phải là chuỗi')
    .isIn(['vi', 'en'])
    .withMessage('Ngôn ngữ phải là vi hoặc en'),
  validate
]; 