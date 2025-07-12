import express, { Router, RequestHandler } from 'express';
import { protect } from '../middleware/auth';
import {
  createMomoPayment,
  momoPaymentCallback,
  momoPaymentIPN,
  createMomoQuickPay
} from '../controllers/paymentController';
import {
  validateCreateMomoPayment,
  validateMomoCallback,
  validateMomoIPN,
  validateMomoQuickPay
} from '../validators/paymentValidator';
import { routeHandler } from '../middleware/routeHandler';

const router: Router = express.Router();

/**
 * @swagger
 * /api/payment/momo/create:
 *   post:
 *     summary: Tạo yêu cầu thanh toán qua MoMo
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID của đơn hàng cần thanh toán
 *     responses:
 *       200:
 *         description: Yêu cầu thanh toán đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     payUrl:
 *                       type: string
 *                       description: URL để chuyển hướng người dùng đến trang thanh toán MoMo
 *                     orderId:
 *                       type: string
 *                       description: ID của đơn hàng
 *                     orderCode:
 *                       type: string
 *                       description: Mã đơn hàng tạo cho MoMo
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.post(
  '/momo/create',
  protect,
  ...validateCreateMomoPayment,
  createMomoPayment as RequestHandler
);

/**
 * @swagger
 * /api/payment/momo/callback:
 *   get:
 *     summary: Nhận callback từ MoMo sau khi người dùng hoàn thành thanh toán
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã đơn hàng từ MoMo
 *       - in: query
 *         name: resultCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã kết quả từ MoMo (0 là thành công)
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *         description: Thông báo từ MoMo
 *     responses:
 *       302:
 *         description: Chuyển hướng người dùng đến trang thông báo kết quả
 */
router.get(
  '/momo/callback',
  ...validateMomoCallback,
  momoPaymentCallback as RequestHandler
);

/**
 * @swagger
 * /api/payment/momo/ipn:
 *   post:
 *     summary: Nhận thông báo IPN (Instant Payment Notification) từ MoMo
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: IPN đã được xử lý thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.post(
  '/momo/ipn',
  ...validateMomoIPN,
  momoPaymentIPN as RequestHandler
);

/**
 * @swagger
 * /api/payment/momo/quickpay:
 *   post:
 *     summary: Tạo yêu cầu thanh toán nhanh qua MoMo (POS/QR)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentCode
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Số tiền thanh toán
 *               paymentCode:
 *                 type: string
 *                 description: Mã QR hoặc mã thanh toán từ MoMo app
 *               orderInfo:
 *                 type: string
 *                 description: Thông tin đơn hàng
 *               orderGroupId:
 *                 type: string
 *                 description: ID nhóm đơn hàng (nếu có)
 *               autoCapture:
 *                 type: boolean
 *                 description: Tự động chấp nhận thanh toán
 *               lang:
 *                 type: string
 *                 description: Ngôn ngữ (vi/en)
 *     responses:
 *       200:
 *         description: Yêu cầu thanh toán đã được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post(
  '/momo/quickpay',
  protect,
  ...validateMomoQuickPay,
  createMomoQuickPay as RequestHandler
);

export default router;