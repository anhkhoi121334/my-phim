import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  cancelOrder
} from '../controllers/orderController';
import {
  validateCreateOrder,
  validateGetOrderById,
  validateUpdateOrderToPaid,
  validateUpdateOrderToDelivered,
  validateCancelOrder
} from '../validators/orderValidator';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *               - itemsPrice
 *               - taxPrice
 *               - shippingPrice
 *               - totalPrice
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               shippingAddress:
 *                 $ref: '#/components/schemas/ShippingAddress'
 *               paymentMethod:
 *                 type: string
 *                 enum: [PayPal, Stripe, Cash on Delivery]
 *                 example: PayPal
 *               itemsPrice:
 *                 type: number
 *                 example: 25000000
 *               taxPrice:
 *                 type: number
 *                 example: 2500000
 *               shippingPrice:
 *                 type: number
 *                 example: 50000
 *               totalPrice:
 *                 type: number
 *                 example: 27550000
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *   get:
 *     summary: Lấy tất cả đơn hàng (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Cần quyền admin
 */
router.route('/')
  .post(protect, validateCreateOrder, addOrderItems)
  .get(protect, authorize('admin'), getOrders);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Lấy đơn hàng của người dùng hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 */
router.route('/myorders')
  .get(protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Đơn hàng không tìm thấy
 */
router.route('/:id')
  .get(protect, validateGetOrderById, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Cập nhật trạng thái thanh toán
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *               - update_time
 *               - payer
 *             properties:
 *               id:
 *                 type: string
 *                 example: PAY-123456789
 *               status:
 *                 type: string
 *                 example: COMPLETED
 *               update_time:
 *                 type: string
 *                 example: 2023-12-01T10:00:00Z
 *               payer:
 *                 type: object
 *                 properties:
 *                   email_address:
 *                     type: string
 *                     example: user@example.com
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Đơn hàng không tìm thấy
 */
router.route('/:id/pay')
  .put(protect, validateUpdateOrderToPaid, updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Cập nhật trạng thái giao hàng (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Cần quyền admin
 *       404:
 *         description: Đơn hàng không tìm thấy
 */
router.route('/:id/deliver')
  .put(protect, authorize('admin'), validateUpdateOrderToDelivered, updateOrderToDelivered);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Hủy đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Không thể hủy đơn hàng đã thanh toán hoặc đã giao
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Đơn hàng không tìm thấy
 */
router.route('/:id/cancel')
  .put(protect, validateCancelOrder, cancelOrder);

export default router; 