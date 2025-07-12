import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import * as couponService from '../services/couponService';

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const createdCoupon = await couponService.createCoupon(req.body);
  
  return res.status(201).json({
    success: true,
    message: 'Tạo mã giảm giá thành công',
    data: createdCoupon
  });
});

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await couponService.getAllCoupons();
  
  return res.json({
    success: true,
    data: coupons
  });
});

/**
 * @desc    Get a coupon by ID
 * @route   GET /api/coupons/:id
 * @access  Private/Admin
 */
export const getCouponById = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await couponService.getCouponById(req.params.id);
  
  return res.json({
    success: true,
    data: coupon
  });
});

/**
 * @desc    Update a coupon
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const updatedCoupon = await couponService.updateCoupon(req.params.id, req.body);
  
  return res.json({
    success: true,
    message: 'Cập nhật mã giảm giá thành công',
    data: updatedCoupon
  });
});

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  await couponService.deleteCoupon(req.params.id);
  
  return res.json({
    success: true,
    message: 'Xóa mã giảm giá thành công'
  });
});

/**
 * @desc    Validate a coupon
 * @route   POST /api/coupons/validate
 * @access  Public
 */
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, amount } = req.body;
  
  const validationResult = await couponService.validateCoupon(code, amount);
  
  return res.json({
    success: true,
    data: validationResult
  });
});

/**
 * @desc    Apply a coupon (increment usedCount)
 * @route   POST /api/coupons/apply
 * @access  Public
 */
export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;
  
  const coupon = await couponService.applyCoupon(code);
  
  return res.json({
    success: true,
    message: 'Áp dụng mã giảm giá thành công',
    data: coupon
  });
});

/**
 * @desc    Send coupon to users
 * @route   POST /api/coupons/:id/send
 * @access  Private/Admin
 */
export const sendCouponToUsers = asyncHandler(async (req: Request, res: Response) => {
  const { userIds } = req.body;
  const couponId = req.params.id;
  
  const result = await couponService.sendCouponToUsers(couponId, userIds);
  
  return res.json({
    success: true,
    message: `Đã gửi mã giảm giá đến ${result.modifiedCount} người dùng`,
    data: result
  });
});

/**
 * @desc    Generate a random coupon
 * @route   POST /api/coupons/random
 * @access  Private/Admin
 */
export const generateRandomCoupon = asyncHandler(async (req: Request, res: Response) => {
  const randomCoupon = await couponService.generateRandomCoupon();
  
  return res.status(201).json({
    success: true,
    message: 'Tạo mã giảm giá ngẫu nhiên thành công',
    data: randomCoupon
  });
});

/**
 * @desc    Get coupons for current user
 * @route   GET /api/coupons/my
 * @access  Private
 */
export const getMyCoupons = asyncHandler(async (req: any, res: Response) => {
  const coupons = await couponService.getUserCoupons(req.user._id);
  
  return res.json({
    success: true,
    data: coupons
  });
}); 