import express from 'express';
import {
  getCategories,
  getCategoryTree,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  deleteAllCategories
} from '../controllers/categoryController';
import { protect, admin } from '../middleware/auth';
import { categoryValidator } from '../validators';

const router = express.Router();

// Public routes
router.get('/', categoryValidator.getCategoriesValidator, getCategories);
router.get('/tree', getCategoryTree);
router.get('/stats', protect, admin, getCategoryStats);
router.get('/slug/:slug', categoryValidator.getCategoryBySlugValidator, getCategoryBySlug);

// Protected routes (Admin only)
router.post('/', protect, admin, categoryValidator.createCategoryValidator, createCategory);

// Special admin routes (phải đặt trước các đường dẫn động)
router.delete('/delete-all', protect, admin, deleteAllCategories);

// Routes with dynamic parameters
router.get('/:id', categoryValidator.getCategoryByIdValidator, getCategory);
router.put('/:id', protect, admin, categoryValidator.updateCategoryValidator, updateCategory);
router.delete('/:id', protect, admin, categoryValidator.deleteCategoryValidator, deleteCategory);

export default router; 