import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import * as paymentService from '../services/paymentService';
import { AsyncRequestHandler } from '../types/express';

/**
 * @desc    Tạo yêu cầu thanh toán MoMo
 * @route   POST /api/payment/momo/create
 * @access  Private
 */
export const createMomoPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: 'Vui lòng đăng nhập để thanh toán'
      });
    }
    
    const paymentData = await paymentService.createMomoPayment(req.user._id, orderId);
    
    res.json({
      success: true,
      data: paymentData
    });
  }
);

/**
 * @desc    Xử lý callback từ MoMo (redirect người dùng)
 * @route   GET /api/payment/momo/callback
 * @access  Public
 */
export const momoPaymentCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, resultCode, message } = req.query;
    
    if (!orderId || !resultCode) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin từ cổng thanh toán'
      });
    }
    
    const result = await paymentService.handleMomoCallback(
      orderId as string, 
      resultCode as string, 
      message as string
    );
    
    // Redirect the user based on the payment result
    res.redirect(result.redirectUrl);
  }
);

/**
 * @desc    Xử lý IPN (Instant Payment Notification) từ MoMo
 * @route   POST /api/payment/momo/ipn
 * @access  Public
 */
export const momoPaymentIPN = asyncHandler(
  async (req: Request, res: Response) => {
    const ipnData = req.body as paymentService.MomoIPNData;
    
    if (!ipnData || !ipnData.orderId || !ipnData.signature) {
      return res.status(400).json({
        success: false,
        error: 'Dữ liệu IPN không hợp lệ'
      });
    }
    
    await paymentService.handleMomoIPN(ipnData);
    
    // MoMo requires a 200 status response if IPN is processed successfully
    res.status(200).json({ message: 'IPN processed successfully' });
  }
);

/**
 * @desc    MoMo Quick Pay (POS)
 * @route   POST /api/payment/momo/quickpay
 * @access  Private
 */
export const createMomoQuickPay = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentData = req.body as paymentService.MomoQuickPayRequest;
    
    if (!paymentData || !paymentData.amount || !paymentData.paymentCode) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin thanh toán'
      });
    }
    
    const result = await paymentService.createMomoQuickPay(paymentData);
    
    res.json({
      success: true,
      data: result
    });
  }
); 