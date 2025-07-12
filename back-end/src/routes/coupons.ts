import express from 'express';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  sendCouponToUsers,
  generateRandomCoupon,
  getMyCoupons
} from '../controllers/couponController';
import {
  validateCreateCoupon,
  validateGetCouponById,
  validateUpdateCoupon,
  validateDeleteCoupon,
  validateCouponValidation,
  validateApplyCoupon,
  validateSendCouponToUsers
} from '../validators/couponValidator';

const router = express.Router();

/**
 * @swagger
 * /api/coupons/send:
 *   post:
 *     summary: Gửi mã giảm giá cho người dùng
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - couponId
 *               - userIds
 *             properties:
 *               couponId:
 *                 type: string
 *                 description: ID của mã giảm giá
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID người dùng nhận mã giảm giá
 *     responses:
 *       200:
 *         description: Mã giảm giá đã được gửi thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy mã giảm giá
 */
router.post('/:id/send', protect, authorize('admin'), validateSendCouponToUsers, sendCouponToUsers);

/**
 * @swagger
 * /api/coupons/random:
 *   post:
 *     summary: Tạo mã giảm giá ngẫu nhiên
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Mã giảm giá ngẫu nhiên đã được tạo thành công
 */
router.post('/random', protect, authorize('admin'), generateRandomCoupon);

/**
 * @swagger
 * /api/coupons/my:
 *   get:
 *     summary: Lấy danh sách mã giảm giá của người dùng
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá của người dùng
 */
router.get('/my', protect, getMyCoupons);

/**
 * @swagger
 * /api/coupons/validate:
 *   post:
 *     summary: Kiểm tra mã giảm giá
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - amount
 *             properties:
 *               code:
 *                 type: string
 *                 description: Mã giảm giá cần kiểm tra
 *               amount:
 *                 type: number
 *                 description: Giá trị đơn hàng để tính toán giảm giá
 *     responses:
 *       200:
 *         description: Mã giảm giá hợp lệ và thông tin giảm giá
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc mã giảm giá không đáp ứng điều kiện
 *       404:
 *         description: Không tìm thấy mã giảm giá
 */
router.post('/validate', validateCouponValidation, validateCoupon);

/**
 * @swagger
 * /api/coupons/apply:
 *   post:
 *     summary: Áp dụng mã giảm giá vào đơn hàng
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Mã giảm giá cần áp dụng
 *     responses:
 *       200:
 *         description: Mã giảm giá đã được áp dụng thành công
 *       400:
 *         description: Mã giảm giá không hợp lệ
 *       404:
 *         description: Không tìm thấy mã giảm giá
 */
router.post('/apply', validateApplyCoupon, applyCoupon);

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Lấy danh sách tất cả mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá
 *   post:
 *     summary: Tạo mã giảm giá mới
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountAmount
 *             properties:
 *               code:
 *                 type: string
 *                 description: Mã giảm giá (sẽ tự động chuyển sang chữ hoa)
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Loại giảm giá (phần trăm hoặc số tiền cố định)
 *               discountAmount:
 *                 type: number
 *                 description: Giá trị giảm giá (% hoặc số tiền)
 *               minimumAmount:
 *                 type: number
 *                 description: Giá trị đơn hàng tối thiểu để áp dụng
 *               maximumDiscount:
 *                 type: number
 *                 description: Giảm giá tối đa (chỉ áp dụng cho loại phần trăm)
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày bắt đầu hiệu lực
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày kết thúc hiệu lực
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *               usageLimit:
 *                 type: number
 *                 description: Giới hạn số lần sử dụng (0 = không giới hạn)
 *               description:
 *                 type: string
 *                 description: Mô tả mã giảm giá
 *     responses:
 *       201:
 *         description: Mã giảm giá đã được tạo thành công
 */
router.route('/')
  .get(protect, authorize('admin'), getCoupons)
  .post(protect, authorize('admin'), validateCreateCoupon, createCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   get:
 *     summary: Lấy thông tin mã giảm giá theo ID
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá
 *     responses:
 *       200:
 *         description: Thông tin mã giảm giá
 *       404:
 *         description: Không tìm thấy mã giảm giá
 *   put:
 *     summary: Cập nhật thông tin mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Mã giảm giá (sẽ tự động chuyển sang chữ hoa)
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Loại giảm giá (phần trăm hoặc số tiền cố định)
 *               discountAmount:
 *                 type: number
 *                 description: Giá trị giảm giá (% hoặc số tiền)
 *               minimumAmount:
 *                 type: number
 *                 description: Giá trị đơn hàng tối thiểu để áp dụng
 *               maximumDiscount:
 *                 type: number
 *                 description: Giảm giá tối đa (chỉ áp dụng cho loại phần trăm)
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày bắt đầu hiệu lực
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày kết thúc hiệu lực
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *               usageLimit:
 *                 type: number
 *                 description: Giới hạn số lần sử dụng (0 = không giới hạn)
 *               description:
 *                 type: string
 *                 description: Mô tả mã giảm giá
 *     responses:
 *       200:
 *         description: Mã giảm giá đã được cập nhật thành công
 *       404:
 *         description: Không tìm thấy mã giảm giá
 *   delete:
 *     summary: Xóa mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá
 *     responses:
 *       200:
 *         description: Mã giảm giá đã được xóa thành công
 *       404:
 *         description: Không tìm thấy mã giảm giá
 */
router.route('/:id')
  .get(protect, authorize('admin'), validateGetCouponById, getCouponById)
  .put(protect, authorize('admin'), validateUpdateCoupon, updateCoupon)
  .delete(protect, authorize('admin'), validateDeleteCoupon, deleteCoupon);

export default router; 