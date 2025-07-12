/**
 * Validators cho các API liên quan đến sản phẩm
 */
import { body, param, query } from 'express-validator';
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
 * Validator cho API tạo sản phẩm mới
 */
export const createProductValidator = [
  body('name')
    .notEmpty().withMessage('Tên sản phẩm là bắt buộc')
    .isLength({ min: 3, max: 200 }).withMessage('Tên sản phẩm phải từ 3-200 ký tự'),
  
  body('description')
    .notEmpty().withMessage('Mô tả sản phẩm là bắt buộc'),
  
  body('brand')
    .notEmpty().withMessage('Thương hiệu là bắt buộc'),
  
  body('category')
    .notEmpty().withMessage('Danh mục là bắt buộc')
    .custom(isValidObjectId).withMessage('ID danh mục không hợp lệ'),
  
  body('mainImage')
    .notEmpty().withMessage('Hình ảnh chính là bắt buộc')
    .isURL().withMessage('Hình ảnh chính phải là URL hợp lệ'),
  
  body('basePrice')
    .optional()
    .isNumeric().withMessage('Giá cơ bản phải là số')
    .isFloat({ min: 0 }).withMessage('Giá cơ bản phải lớn hơn hoặc bằng 0'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  
  body('variants')
    .optional()
    .isArray().withMessage('Biến thể phải là một mảng'),
  
  body('variants.*.price')
    .optional()
    .isNumeric().withMessage('Giá biến thể phải là số')
    .isFloat({ min: 0 }).withMessage('Giá biến thể phải lớn hơn hoặc bằng 0'),
  
  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Số lượng tồn kho biến thể phải là số nguyên không âm'),
  
  body('variants.*.sku')
    .optional()
    .isString().withMessage('SKU phải là chuỗi'),
  
  validate
];

/**
 * Validator cho API cập nhật sản phẩm
 */
export const updateProductValidator = [
  param('id')
    .custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  body('name')
    .optional()
    .isLength({ min: 3, max: 200 }).withMessage('Tên sản phẩm phải từ 3-200 ký tự'),
  
  body('category')
    .optional()
    .custom(isValidObjectId).withMessage('ID danh mục không hợp lệ'),
  
  body('mainImage')
    .optional()
    .isURL().withMessage('Hình ảnh chính phải là URL hợp lệ'),
  
  body('basePrice')
    .optional()
    .isNumeric().withMessage('Giá cơ bản phải là số')
    .isFloat({ min: 0 }).withMessage('Giá cơ bản phải lớn hơn hoặc bằng 0'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  
  body('variants')
    .optional()
    .isArray().withMessage('Biến thể phải là một mảng'),
  
  validate
];

/**
 * Validator cho API lấy sản phẩm theo ID
 */
export const getProductByIdValidator = [
  param('id')
    .custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  validate
];

/**
 * Validator cho API xóa sản phẩm
 */
export const deleteProductValidator = [
  param('id')
    .custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  validate
];

/**
 * Validator cho API lấy variant của sản phẩm theo SKU
 */
export const getProductVariantBySkuValidator = [
  param('id')
    .custom(isValidObjectId).withMessage('ID sản phẩm không hợp lệ'),
  
  param('sku')
    .notEmpty().withMessage('SKU là bắt buộc'),
  
  validate
];

/**
 * Validator cho API lấy sản phẩm nổi bật
 */
export const getFeaturedProductsValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit phải là số nguyên từ 1-50'),
  
  validate
]; 