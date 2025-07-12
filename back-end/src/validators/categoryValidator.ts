/**
 * Validators cho các API liên quan đến danh mục sản phẩm
 */
import { body, param, query } from 'express-validator';
import { validate } from './validate';
import mongoose from 'mongoose';

/**
 * Kiểm tra ObjectId có hợp lệ không
 */
const isValidObjectId = (value: string) => {
  if (!value || value === 'null') return true;
  
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('ID danh mục không hợp lệ');
  }
  return true;
};

/**
 * Validator cho API lấy danh sách danh mục
 */
export const getCategoriesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Số trang phải là số nguyên dương'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Giới hạn phải là số nguyên dương'),
  query('parentId').optional().custom(isValidObjectId),
  query('isActive').optional().isBoolean().withMessage('isActive phải là giá trị boolean'),
  query('sortBy').optional().isString().withMessage('sortBy phải là chuỗi'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder phải là asc hoặc desc'),
  
  validate
];

/**
 * Validator cho API lấy chi tiết danh mục theo ID
 */
export const getCategoryByIdValidator = [
  param('id').custom(isValidObjectId).withMessage('ID danh mục không hợp lệ'),
  
  validate
];

/**
 * Validator cho API lấy chi tiết danh mục theo slug
 */
export const getCategoryBySlugValidator = [
  param('slug')
    .isString().withMessage('Slug phải là chuỗi')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug không hợp lệ'),
  
  validate
];

/**
 * Validator cho API tạo danh mục mới
 */
export const createCategoryValidator = [
  body('name')
    .notEmpty().withMessage('Tên danh mục là bắt buộc')
    .isLength({ min: 2, max: 100 }).withMessage('Tên danh mục phải từ 2-100 ký tự'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Mô tả không được quá 1000 ký tự'),
  
  body('parentId')
    .optional()
    .custom(isValidObjectId),
  
  body('image')
    .optional()
    .isURL().withMessage('URL hình ảnh không hợp lệ'),
  
  body('icon')
    .optional()
    .isString().withMessage('Icon phải là chuỗi'),
  
  body('banner')
    .optional()
    .isURL().withMessage('URL banner không hợp lệ'),
  
  body('metaTitle')
    .optional()
    .isLength({ max: 100 }).withMessage('Meta title không được quá 100 ký tự'),
  
  body('metaDescription')
    .optional()
    .isLength({ max: 200 }).withMessage('Meta description không được quá 200 ký tự'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive phải là giá trị boolean'),
  
  body('isFeature')
    .optional()
    .isBoolean().withMessage('isFeature phải là giá trị boolean'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Thứ tự sắp xếp phải là số nguyên không âm'),
  
  validate
];

/**
 * Validator cho API cập nhật danh mục
 */
export const updateCategoryValidator = [
  param('id')
    .custom(isValidObjectId).withMessage('ID danh mục không hợp lệ'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Tên danh mục phải từ 2-100 ký tự'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Mô tả không được quá 1000 ký tự'),
  
  body('parentId')
    .optional()
    .custom(isValidObjectId),
  
  body('image')
    .optional()
    .isURL().withMessage('URL hình ảnh không hợp lệ'),
  
  body('icon')
    .optional()
    .isString().withMessage('Icon phải là chuỗi'),
  
  body('banner')
    .optional()
    .isURL().withMessage('URL banner không hợp lệ'),
  
  body('metaTitle')
    .optional()
    .isLength({ max: 100 }).withMessage('Meta title không được quá 100 ký tự'),
  
  body('metaDescription')
    .optional()
    .isLength({ max: 200 }).withMessage('Meta description không được quá 200 ký tự'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive phải là giá trị boolean'),
  
  body('isFeature')
    .optional()
    .isBoolean().withMessage('isFeature phải là giá trị boolean'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Thứ tự sắp xếp phải là số nguyên không âm'),
  
  validate
];

/**
 * Validator cho API xóa danh mục
 */
export const deleteCategoryValidator = [
  param('id')
    .custom(isValidObjectId).withMessage('ID danh mục không hợp lệ'),
  
  validate
]; 