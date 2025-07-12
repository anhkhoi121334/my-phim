import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import categoryRoutes from './categories';
import orderRoutes from './orders';
import userRoutes from './users';
import couponRoutes from './coupons';
import paymentRoutes from './payment';
import bannerRoutes from './banners_fixed';

const router = Router();

// Handle favicon.ico requests
router.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check endpoint
router.get('/health-check', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/coupons', couponRoutes);
router.use('/payment', paymentRoutes);
router.use('/banners', bannerRoutes);

export default router; 