import express from 'express';
import {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  toggleBannerStatus,
  getBannersByPosition,
  createRandomBanner
} from '../controllers/bannerController';

import {
  validateGetBanners,
  validateGetBanner,
  validateCreateBanner,
  validateUpdateBanner,
  validateDeleteBanner,
  validateReorderBanners,
  validateToggleBannerStatus,
  validateGetBannersByPosition
} from '../validators/bannerValidator';

import { protect } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = express.Router();

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Lấy danh sách tất cả banner
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [home_main, home_secondary, category_page, product_page, sidebar, popup]
 *         description: Lọc banner theo vị trí
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Lọc banner theo trạng thái hoạt động
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 */
router.get('/', validateGetBanners, getBanners);

/**
 * @swagger
 * /api/banners/position/{position}:
 *   get:
 *     summary: Lấy banner theo vị trí (cho frontend)
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home_main, home_secondary, category_page, product_page, sidebar, popup]
 *         description: Vị trí banner
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 */
router.get('/position/:position', validateGetBannersByPosition, getBannersByPosition);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Lấy thông tin banner theo ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID banner
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Không tìm thấy banner
 */
router.get('/:id', validateGetBanner, getBanner);

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Tạo banner mới (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - imageUrl
 *               - position
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 description: Tiêu đề banner
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Mô tả banner
 *               imageUrl:
 *                 type: string
 *                 description: URL hình ảnh banner
 *               linkUrl:
 *                 type: string
 *                 description: URL liên kết
 *               position:
 *                 type: string
 *                 enum: [home_main, home_secondary, category_page, product_page, sidebar, popup]
 *                 default: home_main
 *                 description: Vị trí hiển thị
 *               order:
 *                 type: number
 *                 default: 0
 *                 description: Thứ tự hiển thị
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày bắt đầu hiển thị
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày kết thúc hiển thị
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Trạng thái kích hoạt
 *     responses:
 *       201:
 *         description: Banner đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/', protect, authorize('admin'), validateCreateBanner, createBanner);

/**
 * @swagger
 * /api/banners/reorder:
 *   put:
 *     summary: Sắp xếp lại thứ tự banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - banners
 *             properties:
 *               banners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - _id
 *                     - order
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID banner
 *                     order:
 *                       type: number
 *                       description: Thứ tự mới
 *     responses:
 *       200:
 *         description: Thứ tự banner đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.put('/reorder', protect, authorize('admin'), validateReorderBanners, reorderBanners);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Cập nhật banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID banner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 description: Tiêu đề banner
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Mô tả banner
 *               imageUrl:
 *                 type: string
 *                 description: URL hình ảnh banner
 *               linkUrl:
 *                 type: string
 *                 description: URL liên kết
 *               position:
 *                 type: string
 *                 enum: [home_main, home_secondary, category_page, product_page, sidebar, popup]
 *                 description: Vị trí hiển thị
 *               order:
 *                 type: number
 *                 description: Thứ tự hiển thị
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày bắt đầu hiển thị
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày kết thúc hiển thị
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *     responses:
 *       200:
 *         description: Banner đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy banner
 */
router.put('/:id', protect, authorize('admin'), validateUpdateBanner, updateBanner);

/**
 * @swagger
 * /api/banners/{id}/toggle-status:
 *   patch:
 *     summary: Đổi trạng thái kích hoạt của banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID banner
 *     responses:
 *       200:
 *         description: Trạng thái banner đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy banner
 */
router.patch('/:id/toggle-status', protect, authorize('admin'), validateToggleBannerStatus, toggleBannerStatus);

/**
 * @swagger
 * /api/banners/random:
 *   post:
 *     summary: Tạo banner ngẫu nhiên (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Banner ngẫu nhiên đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/random', protect, authorize('admin'), createRandomBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Xóa banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID banner
 *     responses:
 *       200:
 *         description: Banner đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy banner
 */
router.delete('/:id', protect, authorize('admin'), validateDeleteBanner, deleteBanner);

export default router; 