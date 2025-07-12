import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductVariantBySku,
  getFeaturedProducts,
  getProductBrands,
  deleteAllProducts
} from '../controllers/productController';
import { protect, admin } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { productValidator } from '../validators';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm với bộ lọc nâng cao
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Danh mục sản phẩm
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Thương hiệu
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name, minPrice, averageRating]
 *         description: Sắp xếp theo
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Thành công
 */
router.route('/')
  .get(getProducts)
  .post(protect, admin, productValidator.createProductValidator, createProduct)
  .delete(protect, admin, deleteAllProducts);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Lấy danh sách sản phẩm nổi bật
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng sản phẩm tối đa
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/featured', productValidator.getFeaturedProductsValidator, getFeaturedProducts);

/**
 * @swagger
 * /api/products/brands:
 *   get:
 *     summary: Lấy danh sách thương hiệu sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/brands', getProductBrands);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.route('/:id')
  .get(productValidator.getProductByIdValidator, getProductById)
  .put(protect, admin, productValidator.updateProductValidator, updateProduct)
  .delete(protect, admin, productValidator.deleteProductValidator, deleteProduct);

/**
 * @swagger
 * /api/products/{id}/variants/{sku}:
 *   get:
 *     summary: Lấy thông tin biến thể sản phẩm theo SKU
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: SKU của biến thể
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy biến thể
 */
router.get('/:id/variants/:sku', productValidator.getProductVariantBySkuValidator, getProductVariantBySku);

export default router; 