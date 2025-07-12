import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import * as orderService from '../services/orderService';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const addOrderItems = asyncHandler(async (req: any, res: Response) => {
  try {
    const createdOrder = await orderService.createOrder(req.user._id, req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: createdOrder
    });
  } catch (error: any) {
    // If the error is already handled by the service (ErrorResponse), it will be caught by asyncHandler
    // This is for other types of errors that might occur
    console.error('Create order error:', error);
    
    // Log chi tiết hơn để gỡ lỗi
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Lỗi xác thực dữ liệu: ' + Object.values(error.errors).map((err: any) => err.message).join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      console.error('Cast error details:', error);
      return res.status(400).json({
        success: false,
        message: `Lỗi kiểu dữ liệu: ${error.path} không hợp lệ`
      });
    }
    
    throw error; // Let asyncHandler handle it
  }
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req: any, res: Response) => {
  const order = await orderService.getOrderById(req.params.id);
  
  return res.json({
    success: true,
    data: order
  });
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
export const updateOrderToPaid = asyncHandler(async (req: any, res: Response) => {
  const updatedOrder = await orderService.updateOrderToPaid(req.params.id, {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address
  });
  
  return res.json({
    success: true,
    message: 'Cập nhật trạng thái thanh toán thành công',
    data: updatedOrder
  });
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req: any, res: Response) => {
  const orders = await orderService.getUserOrders(req.user._id);
  
  return res.json({
    success: true,
    data: orders
  });
});

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  
  return res.json({
    success: true,
    data: orders
  });
});

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
export const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
  const updatedOrder = await orderService.updateOrderToDelivered(req.params.id);
  
  return res.json({
    success: true,
    message: 'Cập nhật trạng thái giao hàng thành công',
    data: updatedOrder
  });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = asyncHandler(async (req: any, res: Response) => {
  const updatedOrder = await orderService.cancelOrder(req.params.id);
  
  return res.json({
    success: true,
    message: 'Hủy đơn hàng thành công',
    data: updatedOrder
  });
}); 