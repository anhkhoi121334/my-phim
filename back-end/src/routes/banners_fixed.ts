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

import { protect } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// Public routes
router.get('/', getBanners);
router.get('/position/:position', getBannersByPosition);
router.get('/:id', getBanner);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createBanner);
router.post('/random', protect, authorize('admin'), createRandomBanner);
router.put('/reorder', protect, authorize('admin'), reorderBanners);
router.put('/:id', protect, authorize('admin'), updateBanner);
router.delete('/:id', protect, authorize('admin'), deleteBanner);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleBannerStatus);

export default router; 