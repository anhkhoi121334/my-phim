import { body, param, query } from 'express-validator';
import { validate } from './validate';

/**
 * Validation for getting banners with filters
 */
export const validateGetBanners = validate([
  query('position')
    .optional()
    .isIn(['home_main', 'home_secondary', 'category_page', 'product_page', 'sidebar', 'popup'])
    .withMessage('Vị trí không hợp lệ'),
  
  query('active')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Trạng thái phải là true hoặc false')
]);

/**
 * Validation for getting a single banner
 */
export const validateGetBanner = validate([
  param('id')
    .isMongoId()
    .withMessage('ID banner không hợp lệ')
]);

/**
 * Validation for creating a new banner
 */
export const validateCreateBanner = validate([
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Vui lòng nhập tiêu đề banner')
    .isLength({ max: 100 })
    .withMessage('Tiêu đề không được vượt quá 100 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mô tả không được vượt quá 500 ký tự'),
  
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Vui lòng cung cấp đường dẫn hình ảnh')
    .isURL()
    .withMessage('Đường dẫn hình ảnh không hợp lệ'),
  
  body('linkUrl')
    .optional()
    .trim(),
  
  body('position')
    .notEmpty()
    .withMessage('Vui lòng chọn vị trí hiển thị')
    .isIn(['home_main', 'home_secondary', 'category_page', 'product_page', 'sidebar', 'popup'])
    .withMessage('Vị trí không hợp lệ'),
  
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Thứ tự phải là số nguyên không âm'),
  
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
    .withMessage('Trạng thái phải là true hoặc false')
]);

/**
 * Validation for updating a banner
 */
export const validateUpdateBanner = validate([
  param('id')
    .isMongoId()
    .withMessage('ID banner không hợp lệ'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tiêu đề không được để trống')
    .isLength({ max: 100 })
    .withMessage('Tiêu đề không được vượt quá 100 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mô tả không được vượt quá 500 ký tự'),
  
  body('imageUrl')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Đường dẫn hình ảnh không được để trống')
    .isURL()
    .withMessage('Đường dẫn hình ảnh không hợp lệ'),
  
  body('linkUrl')
    .optional()
    .trim(),
  
  body('position')
    .optional()
    .isIn(['home_main', 'home_secondary', 'category_page', 'product_page', 'sidebar', 'popup'])
    .withMessage('Vị trí không hợp lệ'),
  
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Thứ tự phải là số nguyên không âm'),
  
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
    .withMessage('Trạng thái phải là true hoặc false')
]);

/**
 * Validation for deleting a banner
 */
export const validateDeleteBanner = validate([
  param('id')
    .isMongoId()
    .withMessage('ID banner không hợp lệ')
]);

/**
 * Validation for reordering banners
 */
export const validateReorderBanners = validate([
  body('banners')
    .isArray({ min: 1 })
    .withMessage('Danh sách banner không được để trống'),
  
  body('banners.*.order')
    .isInt({ min: 0 })
    .withMessage('Thứ tự phải là số nguyên không âm'),
  
  body('banners.*._id')
    .isMongoId()
    .withMessage('ID banner không hợp lệ')
]);

/**
 * Validation for toggling banner status
 */
export const validateToggleBannerStatus = validate([
  param('id')
    .isMongoId()
    .withMessage('ID banner không hợp lệ')
]);

/**
 * Validation for getting banners by position
 */
export const validateGetBannersByPosition = validate([
  param('position')
    .isIn(['home_main', 'home_secondary', 'category_page', 'product_page', 'sidebar', 'popup'])
    .withMessage('Vị trí không hợp lệ')
]); 