/**
 * Export tất cả các validators từ một điểm duy nhất
 */
import * as productValidator from './productValidator';
import * as authValidator from './authValidator';
import * as categoryValidator from './categoryValidator';
import * as userValidator from './userValidator';
import * as bannerValidator from './bannerValidator';
import * as orderValidator from './orderValidator';
import * as couponValidator from './couponValidator';
import * as paymentValidator from './paymentValidator';

export {
  productValidator,
  authValidator,
  categoryValidator,
  userValidator,
  bannerValidator,
  orderValidator,
  couponValidator,
  paymentValidator
}; 