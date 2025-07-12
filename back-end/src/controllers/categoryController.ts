import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services';

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng item trên mỗi trang
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: ID danh mục cha
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Trạng thái hoạt động
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
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const filters = {
      parentId: req.query.parentId as string,
      isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string
    };
    
    const result = await categoryService.getCategories(page, limit, filters);

    return res.status(200).json({
      success: true,
      data: result.categories,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/tree:
 *   get:
 *     summary: Lấy cấu trúc cây danh mục phân cấp
 *     tags: [Categories]
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
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
// @desc    Get category tree (hierarchical)
// @route   GET /api/categories/tree
// @access  Public
export const getCategoryTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryTree = await categoryService.getCategoryTree();

    return res.status(200).json({
      success: true,
      data: categoryTree
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
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
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 */
// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Lấy chi tiết danh mục theo slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của danh mục
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
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 */
// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Điện thoại
 *               description:
 *                 type: string
 *                 example: Các loại điện thoại di động
 *               parentId:
 *                 type: string
 *                 example: null
 *               image:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               icon:
 *                 type: string
 *                 example: phone
 *               banner:
 *                 type: string
 *                 example: https://example.com/banner.jpg
 *               metaTitle:
 *                 type: string
 *                 example: Điện thoại chính hãng
 *               metaDescription:
 *                 type: string
 *                 example: Mua điện thoại chính hãng giá tốt
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               isFeature:
 *                 type: boolean
 *                 example: false
 *               sortOrder:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parentId:
 *                 type: string
 *               image:
 *                 type: string
 *               icon:
 *                 type: string
 *               banner:
 *                 type: string
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               isFeature:
 *                 type: boolean
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 */
// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Xóa danh mục thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 */
// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/stats:
 *   get:
 *     summary: Lấy thống kê về danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
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
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active:
 *                       type: integer
 *                     inactive:
 *                       type: integer
 *                     parent:
 *                       type: integer
 *                     featured:
 *                       type: integer
 */
// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Private/Admin
export const getCategoryStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await categoryService.getCategoryStats();

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/delete-all:
 *   delete:
 *     summary: Xóa tất cả danh mục (chỉ dùng cho mục đích phát triển)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa tất cả danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đã xóa tất cả danh mục
 *       401:
 *         description: Không có quyền truy cập
 */
// @desc    Delete all categories (development only)
// @route   DELETE /api/categories/delete-all
// @access  Private/Admin
export const deleteAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.deleteAllCategories();

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}; 