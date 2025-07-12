import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import Order from '../models/Order';
import { AppError } from '../utils/errorResponse';
import { momoConfig } from '../config/momo.config';

// Types for payment service
export interface MomoPaymentResponse {
  payUrl: string;
  orderId: string;
  orderCode: string;
}

export interface MomoCallbackResult {
  success: boolean;
  redirectUrl: string;
}

export interface MomoIPNData {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: string;
  message: string;
  payType: string;
  responseTime: string;
  extraData: string;
  signature: string;
  [key: string]: any;
}

export interface MomoQuickPayRequest {
  amount: number;
  paymentCode: string;
  orderInfo?: string;
  orderGroupId?: string;
  autoCapture?: boolean;
  lang?: string;
}

/**
 * Create signature for MoMo payment
 */
export const createMomoSignature = (rawSignature: string, secretKey: string): string => {
  return crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
};

/**
 * Create MoMo payment request
 */
export const createMomoPayment = async (userId: string, orderId: string): Promise<MomoPaymentResponse> => {
  // Validate orderId
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError('orderId không hợp lệ', 400);
  }

  // Get order information
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }

  // Check access permission
  if (order.user.toString() !== userId && userId !== 'admin') {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  // Check if order is already paid
  if (order.isPaid) {
    throw new AppError('Đơn hàng này đã được thanh toán', 400);
  }

  // Create unique order code for MoMo
  const orderCode = `ORDER_${Date.now()}_${uuidv4().substring(0, 8)}`;
  
  // Update order code in DB
  order.orderCode = orderCode;
  await order.save();
  
  try {
    // Prepare data for MoMo
    const amount = Math.round(order.totalPrice);
    const orderInfo = `Thanh toan don hang #${order._id}`;
    
    // Create payment parameters
    const requestId = uuidv4();
    const requestType = momoConfig.requestType;
    const extraData = Buffer.from(JSON.stringify({
      orderId: order._id.toString()
    })).toString('base64');
    
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderCode}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = createMomoSignature(rawSignature, momoConfig.secretKey);
    
    // Create payload for MoMo
    const requestBody = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderCode,
      orderInfo: orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi'
    };

    // Send request to MoMo
    const response = await axios.post(momoConfig.endpoint, requestBody);
    
    // Return payUrl for client
    return {
      payUrl: response.data.payUrl,
      orderId: order._id.toString(),
      orderCode: orderCode
    };
  } catch (error) {
    console.error('MoMo payment error:', error);
    if (axios.isAxiosError(error)) {
      throw new AppError(
        `Lỗi kết nối đến cổng thanh toán: ${error.response?.data?.message || error.message}`, 
        error.response?.status || 500
      );
    }
    throw new AppError('Lỗi khi tạo yêu cầu thanh toán', 500);
  }
};

/**
 * Handle MoMo payment callback
 */
export const handleMomoCallback = async (
  orderId: string, 
  resultCode: string, 
  message: string
): Promise<MomoCallbackResult> => {
  if (!orderId) {
    throw new AppError('Thiếu thông tin đơn hàng', 400);
  }
  
  // Find order by MoMo order code
  const order = await Order.findOne({ orderCode: orderId });
  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  // Return redirect URL based on payment result
  if (resultCode === '0') {
    // Payment successful - Redirect to thank you page
    return {
      success: true,
      redirectUrl: `${frontendUrl}/order-success/${order._id}`
    };
  } else {
    // Payment failed - Redirect to error page
    return {
      success: false,
      redirectUrl: `${frontendUrl}/order-failed/${order._id}?message=${encodeURIComponent(message || 'Thanh toán thất bại')}`
    };
  }
};

/**
 * Handle MoMo IPN (Instant Payment Notification)
 */
export const handleMomoIPN = async (ipnData: MomoIPNData) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature
  } = ipnData;

  // Verify signature from MoMo
  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  
  const computedSignature = createMomoSignature(rawSignature, momoConfig.secretKey);
  
  if (signature !== computedSignature) {
    throw new AppError('Chữ ký không hợp lệ', 400);
  }
  
  // Find order by MoMo order code
  const order = await Order.findOne({ orderCode: orderId });
  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }
  
  // Update order status based on payment result
  if (resultCode === '0') {
    // Payment successful
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: orderId,
      status: 'COMPLETED',
      update_time: responseTime,
      method: 'MoMo',
      transaction_id: transId,
      payment_provider: 'MoMo',
      raw_response: ipnData
    };
    
    await order.save();
  }
  
  return { success: true, message: 'IPN processed successfully' };
};

/**
 * Create MoMo Quick Pay (POS) payment
 */
export const createMomoQuickPay = async (paymentData: MomoQuickPayRequest) => {
  const {
    amount,
    paymentCode,
    orderInfo = 'Thanh toán qua MoMo',
    orderGroupId = '',
    autoCapture = true,
    lang = 'vi'
  } = paymentData;

  try {
    // Create orderId and requestId
    const partnerCode = momoConfig.partnerCode;
    const accessKey = momoConfig.accessKey;
    const secretKey = momoConfig.secretKey;
    const orderId = `QUICKPAY_${partnerCode}_${Date.now()}`;
    const requestId = orderId;
    const extraData = '';

    // Create rawSignature in correct format
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&paymentCode=${paymentCode}` +
      `&requestId=${requestId}`;

    const signature = createMomoSignature(rawSignature, secretKey);

    // Create request body
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      orderGroupId,
      paymentCode,
      autoCapture,
      lang,
      signature,
      extraData
    };

    // Send request to MoMo
    const response = await axios.post(
      'https://test-payment.momo.vn/pay/pos',
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error('MoMo QuickPay error:', error);
    if (axios.isAxiosError(error)) {
      throw new AppError(
        `Lỗi kết nối đến cổng thanh toán: ${error.response?.data?.message || error.message}`, 
        error.response?.status || 500
      );
    }
    throw new AppError('Lỗi khi tạo yêu cầu thanh toán QuickPay', 500);
  }
}; 