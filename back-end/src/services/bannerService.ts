import { Types } from 'mongoose';
import Banner, { IBanner } from '../models/Banner';
import { AppError } from '../utils/errorResponse';

interface BannerQuery {
  position?: string;
  isActive?: boolean;
  $and?: any[];
}

interface ReorderBannerItem {
  _id: string;
  order: number;
}

/**
 * Get all banners with optional filtering
 */
export const getAllBanners = async (position?: string, active?: string) => {
  let query: BannerQuery = {};
  
  // Filter by position if provided
  if (position) {
    query.position = position;
  }
  
  // Filter by active status if provided
  if (active === 'true') {
    query.isActive = true;
    
    // Only return banners that are currently active based on dates
    const now = new Date();
    query.$and = [
      { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] }
    ];
  } else if (active === 'false') {
    query.isActive = false;
  }
  
  // Execute query with sorting by position and order
  const banners = await Banner.find(query).sort({ position: 1, order: 1 });
  
  return banners;
};

/**
 * Get a single banner by ID
 */
export const getBannerById = async (id: string) => {
  const banner = await Banner.findById(id);
  
  if (!banner) {
    throw new AppError(`Không tìm thấy banner với ID ${id}`, 404);
  }
  
  return banner;
};

/**
 * Create a new banner
 */
export const createNewBanner = async (bannerData: Partial<IBanner>) => {
  const banner = await Banner.create(bannerData);
  return banner;
};

/**
 * Update an existing banner
 */
export const updateBannerById = async (id: string, bannerData: Partial<IBanner>) => {
  let banner = await Banner.findById(id);
  
  if (!banner) {
    throw new AppError(`Không tìm thấy banner với ID ${id}`, 404);
  }
  
  // Update banner
  banner = await Banner.findByIdAndUpdate(id, bannerData, {
    new: true,
    runValidators: true
  });
  
  return banner;
};

/**
 * Delete a banner by ID
 */
export const deleteBannerById = async (id: string) => {
  const banner = await Banner.findById(id);
  
  if (!banner) {
    throw new AppError(`Không tìm thấy banner với ID ${id}`, 404);
  }
  
  // Remove banner
  await Banner.findByIdAndDelete(id);
  
  return true;
};

/**
 * Reorder multiple banners
 */
export const reorderBannersList = async (banners: ReorderBannerItem[]) => {
  if (!banners || !Array.isArray(banners)) {
    throw new AppError('Vui lòng cung cấp danh sách banner với ID và thứ tự mới', 400);
  }
  
  // Update each banner's order in a transaction
  const session = await Banner.startSession();
  session.startTransaction();
  
  try {
    for (const item of banners) {
      if (!item._id || typeof item.order !== 'number') {
        throw new AppError('Mỗi banner phải có ID và thứ tự', 400);
      }
      
      await Banner.findByIdAndUpdate(
        item._id,
        { order: item.order },
        { session }
      );
    }
    
    await session.commitTransaction();
    
    // Fetch updated banners
    const updatedBanners = await Banner.find({
      _id: { $in: banners.map(b => b._id) }
    }).sort({ position: 1, order: 1 });
    
    return updatedBanners;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Toggle a banner's active status
 */
export const toggleBannerActiveStatus = async (id: string) => {
  const banner = await Banner.findById(id);
  
  if (!banner) {
    throw new AppError(`Không tìm thấy banner với ID ${id}`, 404);
  }
  
  // Toggle the active status
  banner.isActive = !banner.isActive;
  await banner.save();
  
  return banner;
};

/**
 * Get banners by position for public display
 */
export const getBannersByPositionName = async (position: string) => {
  const now = new Date();
  
  // Find active banners for the specified position that are currently active by date
  const banners = await Banner.find({
    position,
    isActive: true,
    $and: [
      { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] }
    ]
  }).sort({ order: 1 });
  
  return banners;
};

/**
 * Create a random banner (for testing/demo purposes)
 */
export const createRandomBannerData = async () => {
  const titles = [
    'Khuyến mãi sốc cuối tuần!',
    'Chào hè rực rỡ',
    'Mua 1 tặng 1',
    'Giảm giá cực mạnh',
    'Flash Sale chỉ hôm nay'
  ];
  const descriptions = [
    'Nhanh tay nhận ưu đãi cực lớn!',
    'Sản phẩm hot, giá cực tốt!',
    'Chỉ áp dụng cho đơn hàng đầu tiên.',
    'Số lượng có hạn, đừng bỏ lỡ!',
    'Ưu đãi dành riêng cho bạn!'
  ];
  const images = [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80'
  ];
  const links = [
    '/products?random=true',
    '/sale',
    '/products/featured',
    '/categories/electronics'
  ];
  const positions = ['home_main', 'home_secondary', 'category_page', 'sidebar'];
  
  // Generate random banner data
  const randomBanner = {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    imageUrl: images[Math.floor(Math.random() * images.length)],
    linkUrl: links[Math.floor(Math.random() * links.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    order: Math.floor(Math.random() * 10),
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isActive: Math.random() > 0.3 // 70% chance of being active
  };
  
  const banner = await Banner.create(randomBanner);
  return banner;
}; 