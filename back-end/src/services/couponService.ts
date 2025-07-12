import { Types } from 'mongoose';
import Coupon, { ICoupon } from '../models/Coupon';
import User from '../models/User';
import { AppError } from '../utils/errorResponse';

/**
 * Create a new coupon
 */
export const createCoupon = async (couponData: Partial<ICoupon>) => {
  // Loại bỏ _id nếu được truyền vào từ request để tránh lỗi ObjectId
  const { _id, ...validCouponData } = couponData as any;
  
  // Chuyển mã giảm giá sang chữ hoa
  if (validCouponData.code) {
    validCouponData.code = validCouponData.code.toUpperCase();
  }
  
  // Kiểm tra xem mã giảm giá đã tồn tại chưa
  const existingCoupon = await Coupon.findOne({ code: validCouponData.code });
  if (existingCoupon) {
    throw new AppError('Mã giảm giá đã tồn tại', 400);
  }
  
  const coupon = new Coupon(validCouponData);
  const createdCoupon = await coupon.save();
  
  return createdCoupon;
};

/**
 * Get all coupons
 */
export const getAllCoupons = async () => {
  const coupons = await Coupon.find({});
  return coupons;
};

/**
 * Get a coupon by ID
 */
export const getCouponById = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  
  if (!coupon) {
    throw new AppError('Mã giảm giá không tồn tại', 404);
  }
  
  return coupon;
};

/**
 * Update a coupon
 */
export const updateCoupon = async (couponId: string, couponData: Partial<ICoupon>) => {
  const coupon = await Coupon.findById(couponId);
  
  if (!coupon) {
    throw new AppError('Mã giảm giá không tồn tại', 404);
  }
  
  // Chuyển mã giảm giá sang chữ hoa nếu được cung cấp
  if (couponData.code) {
    couponData.code = couponData.code.toUpperCase();
    
    // Kiểm tra xem mã giảm giá mới đã tồn tại chưa (nếu khác với mã cũ)
    if (couponData.code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      if (existingCoupon) {
        throw new AppError('Mã giảm giá đã tồn tại', 400);
      }
    }
  }
  
  const updatedCoupon = await Coupon.findByIdAndUpdate(
    couponId,
    couponData,
    { new: true, runValidators: true }
  );
  
  return updatedCoupon;
};

/**
 * Delete a coupon
 */
export const deleteCoupon = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  
  if (!coupon) {
    throw new AppError('Mã giảm giá không tồn tại', 404);
  }
  
  await coupon.deleteOne();
  return true;
};

/**
 * Validate a coupon
 */
export const validateCoupon = async (code: string, amount: number) => {
  if (!code || !amount) {
    throw new AppError('Vui lòng cung cấp mã giảm giá và số tiền', 400);
  }
  
  // Tìm mã giảm giá, chuyển sang chữ hoa để so sánh
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });
  
  // Kiểm tra mã giảm giá có tồn tại không
  if (!coupon) {
    throw new AppError('Mã giảm giá không hợp lệ hoặc đã hết hạn', 404);
  }
  
  // Kiểm tra giới hạn sử dụng
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Mã giảm giá đã hết lượt sử dụng', 400);
  }
  
  // Kiểm tra số tiền tối thiểu
  if (amount < coupon.minimumAmount) {
    throw new AppError(`Giá trị đơn hàng tối thiểu phải từ ${coupon.minimumAmount.toLocaleString()}₫`, 400);
  }
  
  // Tính toán giá trị giảm giá
  let discountAmount = 0;
  
  if (coupon.discountType === 'percentage') {
    discountAmount = (amount * coupon.discountAmount) / 100;
    
    // Áp dụng giảm giá tối đa nếu có
    if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }
  } else {
    // Loại giảm giá cố định
    discountAmount = coupon.discountAmount;
  }
  
  // Đảm bảo giá trị giảm giá không vượt quá giá trị đơn hàng
  if (discountAmount > amount) {
    discountAmount = amount;
  }
  
  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountAmount: coupon.discountAmount,
    appliedDiscount: discountAmount,
    description: coupon.description
  };
};

/**
 * Apply a coupon (increment usedCount)
 */
export const applyCoupon = async (code: string) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  
  if (!coupon) {
    throw new AppError('Mã giảm giá không tồn tại', 404);
  }
  
  coupon.usedCount += 1;
  await coupon.save();
  
  return coupon;
};

/**
 * Send coupon to users
 */
export const sendCouponToUsers = async (couponId: string, userIds: string[]) => {
  const coupon = await Coupon.findById(couponId);
  
  if (!coupon) {
    throw new AppError('Mã giảm giá không tồn tại', 404);
  }
  
  if (!userIds || userIds.length === 0) {
    throw new AppError('Vui lòng chọn ít nhất một người dùng', 400);
  }
  
  // Thêm mã giảm giá vào danh sách mã giảm giá của người dùng
  const updateResult = await User.updateMany(
    { _id: { $in: userIds.map(id => new Types.ObjectId(id)) } },
    { $addToSet: { coupons: couponId } }
  );
  
  return {
    coupon,
    modifiedCount: updateResult.modifiedCount
  };
};

/**
 * Generate a random coupon
 */
export const generateRandomCoupon = async () => {
  // Tạo mã ngẫu nhiên
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Tạo mã giảm giá ngẫu nhiên
  const randomCoupon = {
    code: `${randomCode}`,
    description: `Mã giảm giá ngẫu nhiên ${randomCode}`,
    discountType: Math.random() > 0.5 ? 'percentage' : 'fixed',
    discountAmount: Math.random() > 0.5 
      ? Math.floor(Math.random() * 50) + 5 // Phần trăm từ 5-55%
      : Math.floor(Math.random() * 100000) + 10000, // Giá trị cố định từ 10,000 đến 110,000
    minimumAmount: Math.floor(Math.random() * 500000) + 100000, // Từ 100,000 đến 600,000
    maximumDiscount: Math.floor(Math.random() * 200000) + 50000, // Từ 50,000 đến 250,000
    startDate: new Date(),
    endDate: new Date(Date.now() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000), // 1-31 ngày
    isActive: true,
    usageLimit: Math.floor(Math.random() * 100) + 1, // 1-100 lượt sử dụng
    usedCount: 0
  };
  
  const coupon = new Coupon(randomCoupon);
  const createdCoupon = await coupon.save();
  
  return createdCoupon;
};

/**
 * Get coupons for a specific user
 */
export const getUserCoupons = async (userId: string) => {
  // Sử dụng any để tạm thời giải quyết vấn đề thiếu trường coupons trong interface
  const user = await User.findById(userId).populate('coupons') as any;
  
  if (!user) {
    throw new AppError('Người dùng không tồn tại', 404);
  }
  
  // Lọc ra các mã giảm giá còn hiệu lực
  const now = new Date();
  const validCoupons = user.coupons ? user.coupons.filter((coupon: any) => {
    return (
      coupon.isActive &&
      coupon.startDate <= now &&
      coupon.endDate >= now &&
      (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit)
    );
  }) : [];
  
  return validCoupons;
}; 