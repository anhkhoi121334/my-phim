/**
 * Service xử lý logic nghiệp vụ liên quan đến sản phẩm
 */
import Product from '../models/Product';
import { Types } from 'mongoose';

/**
 * Lấy danh sách sản phẩm với các bộ lọc
 */
export const getAllProducts = async (query: any = {}) => {
  const products = await Product.find()
    .populate('category', 'name');
  
  // Đảm bảo mỗi sản phẩm đều có trường stock
  return products.map(product => {
    const productObj = product.toObject();
    
    // Nếu không có trường stock hoặc stock = 0, tính tổng từ variants
    if (!productObj.stock || productObj.stock === 0) {
      if (productObj.variants && productObj.variants.length > 0) {
        productObj.stock = productObj.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
      }
    }
    
    return productObj;
  });
};

/**
 * Lấy thông tin chi tiết sản phẩm theo ID
 */
export const getProductById = async (productId: string) => {
  const product = await Product.findById(productId)
    .populate('reviews.user', 'name avatar');

  if (!product) {
    throw new Error('Sản phẩm không tìm thấy');
  }

  // Chuyển đổi sang object để có thể sửa đổi
  const productObj = product.toObject();
  
  // Nếu không có trường stock hoặc stock = 0, tính tổng từ variants
  if (!productObj.stock || productObj.stock === 0) {
    if (productObj.variants && productObj.variants.length > 0) {
      productObj.stock = productObj.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    }
  }
  
  return productObj;
};

/**
 * Tạo sản phẩm mới
 */
export const createProduct = async (productData: any) => {
  const {
    name,
    description,
    shortDescription,
    brand,
    category,
    subCategory,
    mainImage,
    images,
    variants,
    specifications,
    basePrice,
    tags,
    warranty,
    returnPolicy,
    shippingInfo,
    seo,
    stock
  } = productData;

  // Validate required fields
  if (!name || !description || !brand || !category || !mainImage) {
    throw new Error('Thiếu thông tin bắt buộc: name, description, brand, category, mainImage');
  }

  // Calculate min/max prices from variants or use basePrice
  let minPrice = basePrice || 0;
  let maxPrice = basePrice || 0;
  
  if (variants && variants.length > 0) {
    const prices = variants.map((v: any) => v.price || 0);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  const product = new Product({
    name,
    description,
    shortDescription,
    brand,
    category,
    subCategory,
    mainImage,
    images: images || [],
    variants: variants || [],
    specifications: specifications || [],
    basePrice: basePrice || minPrice,
    minPrice,
    maxPrice,
    stock: stock || 0,
    tags: tags || [],
    warranty,
    returnPolicy,
    shippingInfo,
    seo
  });

  return await product.save();
};

/**
 * Cập nhật thông tin sản phẩm
 */
export const updateProduct = async (productId: string, updateData: any) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Sản phẩm không tìm thấy');
  }
  
  // Recalculate min/max prices if variants are updated
  if (updateData.variants) {
    const prices = updateData.variants.map((v: any) => v.price);
    updateData.minPrice = Math.min(...prices);
    updateData.maxPrice = Math.max(...prices);
  }

  return await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );
};

/**
 * Xóa sản phẩm
 */
export const deleteProduct = async (productId: string) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error('Sản phẩm không tìm thấy');
  }
  
  await Product.findByIdAndDelete(productId);
  return true;
};

/**
 * Lấy variant của sản phẩm theo SKU
 */
export const getProductVariantBySku = async (productId: string, sku: string) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error('Sản phẩm không tìm thấy');
  }
  
  const variant = product.variants.find(v => v.sku === sku);
  
  if (!variant) {
    throw new Error('Variant không tìm thấy');
  }
  
  return variant;
};

/**
 * Lấy danh sách sản phẩm nổi bật
 */
export const getFeaturedProducts = async (limit: number = 10) => {
  const products = await Product.find({ featured: true })
    .limit(limit)
    .populate('category', 'name');
    
  return products;
};

/**
 * Lấy danh sách thương hiệu sản phẩm
 */
export const getProductBrands = async () => {
  return await Product.distinct('brand');
};

/**
 * Xóa tất cả sản phẩm (chỉ dùng cho development)
 */
export const deleteAllProducts = async () => {
  await Product.deleteMany({});
  return true;
}; 