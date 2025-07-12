import dotenv from 'dotenv';

dotenv.config();

// Default Test credentials if environment variables aren't set
const DEFAULT_MOMO_TEST = {
  partnerCode: 'MOMO',
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: 'https://momo.vn/return',
  ipnUrl: 'https://callback.url/notify',
};

/**
 * MoMo payment gateway configuration
 * Uses environment variables if available, otherwise falls back to test values
 */
export const momoConfig = {
  // Main connection settings
  partnerCode: process.env.MOMO_PARTNER_CODE || DEFAULT_MOMO_TEST.partnerCode,
  accessKey: process.env.MOMO_ACCESS_KEY || DEFAULT_MOMO_TEST.accessKey,
  secretKey: process.env.MOMO_SECRET_KEY || DEFAULT_MOMO_TEST.secretKey,
  
  // Endpoints
  endpoint: process.env.MOMO_ENDPOINT || DEFAULT_MOMO_TEST.endpoint,
  
  // Callback URLs
  redirectUrl: process.env.MOMO_REDIRECT_URL || 
    (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/payment/momo/result` : DEFAULT_MOMO_TEST.redirectUrl),
  ipnUrl: process.env.MOMO_IPN_URL || 
    (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/payment/momo/ipn` : DEFAULT_MOMO_TEST.ipnUrl),
  
  // Additional settings
  requestType: process.env.MOMO_REQUEST_TYPE || 'captureWallet',
  extraData: '', // Additional data if needed
  orderExpireTime: parseInt(process.env.MOMO_ORDER_EXPIRE_TIME || '15'), // Order expiration time in minutes
  
  // Environment flag
  isProduction: process.env.NODE_ENV === 'production'
}; 