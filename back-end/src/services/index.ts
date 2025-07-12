/**
 * Export tất cả các services từ một điểm duy nhất
 * Giúp import services dễ dàng hơn trong các files khác
 */

import * as authService from './authService';
import * as productService from './productService';
import * as categoryService from './categoryService';
import * as orderService from './orderService';
import * as userService from './userService';
import * as couponService from './couponService';
import * as paymentService from './paymentService';
import * as bannerService from './bannerService';

export {
  authService,
  productService,
  categoryService,
  orderService,
  userService,
  couponService,
  paymentService,
  bannerService
}; 