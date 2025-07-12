import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  updateAvatar, 
  updatePassword,
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
  setMyDefaultAddress,
  getMyWishlist,
  addToMyWishlist,
  removeFromMyWishlist
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { authValidator } from '../validators';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/register', authValidator.registerValidator, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */
router.post('/login', authValidator.loginValidator, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Authentication]
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
 *         description: Không có token hoặc token không hợp lệ
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 */
router.put('/me', protect, authValidator.updateProfileValidator, updateProfile);

/**
 * @swagger
 * /api/auth/avatar:
 *   put:
 *     summary: Cập nhật ảnh đại diện
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 description: URL hoặc base64 của ảnh đại diện
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 */
router.put('/avatar', protect, authValidator.updateAvatarValidator, updateAvatar);

/**
 * @swagger
 * /api/auth/password:
 *   put:
 *     summary: Thay đổi mật khẩu
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thay đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Mật khẩu hiện tại không đúng
 */
router.put('/password', protect, authValidator.updatePasswordValidator, updatePassword);

/**
 * @swagger
 * /api/auth/addresses:
 *   get:
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/addresses', protect, getMyAddresses);

/**
 * @swagger
 * /api/auth/addresses:
 *   post:
 *     summary: Thêm địa chỉ mới
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - province
 *               - district
 *               - ward
 *               - street
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               street:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Thêm địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/addresses', protect, authValidator.addAddressValidator, addMyAddress);

/**
 * @swagger
 * /api/auth/addresses/{addressId}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               street:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/addresses/:addressId', protect, authValidator.updateAddressValidator, updateMyAddress);

/**
 * @swagger
 * /api/auth/addresses/{addressId}:
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/addresses/:addressId', protect, authValidator.deleteAddressValidator, deleteMyAddress);

/**
 * @swagger
 * /api/auth/addresses/{addressId}/default:
 *   put:
 *     summary: Đặt địa chỉ mặc định
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đặt địa chỉ mặc định thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/addresses/:addressId/default', protect, authValidator.setDefaultAddressValidator, setMyDefaultAddress);

/**
 * @swagger
 * /api/auth/wishlist:
 *   get:
 *     summary: Lấy danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/wishlist', protect, getMyWishlist);

/**
 * @swagger
 * /api/auth/wishlist:
 *   post:
 *     summary: Thêm sản phẩm vào danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm vào danh sách yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/wishlist', protect, authValidator.addToWishlistValidator, addToMyWishlist);

/**
 * @swagger
 * /api/auth/wishlist/{productId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa khỏi danh sách yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/wishlist/:productId', protect, authValidator.removeFromWishlistValidator, removeFromMyWishlist);

export default router; 