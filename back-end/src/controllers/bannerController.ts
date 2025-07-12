import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import * as bannerService from '../services/bannerService';

/**
 * @desc    Get all banners
 * @route   GET /api/banners
 * @access  Public
 */
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const { position, active } = req.query;
  
  const banners = await bannerService.getAllBanners(
    position as string | undefined, 
    active as string | undefined
  );
  
  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners
  });
});

/**
 * @desc    Get single banner
 * @route   GET /api/banners/:id
 * @access  Public
 */
export const getBanner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const banner = await bannerService.getBannerById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: banner
  });
});

/**
 * @desc    Create banner
 * @route   POST /api/banners
 * @access  Private (Admin)
 */
export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerService.createNewBanner(req.body);
  
  res.status(201).json({
    success: true,
    data: banner
  });
});

/**
 * @desc    Update banner
 * @route   PUT /api/banners/:id
 * @access  Private (Admin)
 */
export const updateBanner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const banner = await bannerService.updateBannerById(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    data: banner
  });
});

/**
 * @desc    Delete banner
 * @route   DELETE /api/banners/:id
 * @access  Private (Admin)
 */
export const deleteBanner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await bannerService.deleteBannerById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Update banner order
 * @route   PUT /api/banners/reorder
 * @access  Private (Admin)
 */
export const reorderBanners = asyncHandler(async (req: Request, res: Response) => {
  const { banners } = req.body;
  
  const updatedBanners = await bannerService.reorderBannersList(banners);
  
  return res.status(200).json({
    success: true,
    data: updatedBanners
  });
});

/**
 * @desc    Toggle banner active status
 * @route   PATCH /api/banners/:id/toggle-status
 * @access  Private (Admin)
 */
export const toggleBannerStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const banner = await bannerService.toggleBannerActiveStatus(req.params.id);
  
  res.status(200).json({
    success: true,
    data: banner
  });
});

/**
 * @desc    Get banners by position for public display
 * @route   GET /api/banners/position/:position
 * @access  Public
 */
export const getBannersByPosition = asyncHandler(async (req: Request, res: Response) => {
  const { position } = req.params;
  
  const banners = await bannerService.getBannersByPositionName(position);
  
  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners
  });
});

/**
 * @desc    Tạo banner random (Admin)
 * @route   POST /api/banners/random
 * @access  Private (Admin)
 */
export const createRandomBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerService.createRandomBannerData();
  
  res.status(201).json({
    success: true,
    data: banner
  });
}); 