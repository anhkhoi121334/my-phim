import { body, validationResult } from 'express-validator';

// Validation middleware
export const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải có từ 2-50 ký tự'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
];

// Product validation rules
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên sản phẩm phải có từ 2-100 ký tự'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mô tả phải có từ 10-1000 ký tự'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Giá phải là số dương'),
  body('category')
    .isIn(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'])
    .withMessage('Danh mục không hợp lệ'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('Phải có ít nhất 1 hình ảnh')
];

// Order validation rules
export const validateOrder = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Địa chỉ giao hàng là bắt buộc'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Thành phố là bắt buộc'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Mã bưu điện là bắt buộc'),
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Quốc gia là bắt buộc'),
  body('paymentMethod')
    .isIn(['PayPal', 'Stripe', 'Cash on Delivery'])
    .withMessage('Phương thức thanh toán không hợp lệ')
]; 