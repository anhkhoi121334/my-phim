import { Request, Response, NextFunction } from 'express';
import { productService } from '../services';
import { NotFoundError, ValidationError } from '../utils/errorResponse';

// @desc    Get all products with advanced filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts(req.query);
    
    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product with variants and specifications
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product with variants
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdProduct = await productService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: createdProduct
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);

    return res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    
    return res.json({
      success: true,
      message: 'Xóa sản phẩm thành công',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product variant by SKU
// @route   GET /api/products/:id/variants/:sku
// @access  Public
export const getProductVariantBySku = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variant = await productService.getProductVariantBySku(req.params.id, req.params.sku);
    
    return res.json({
      success: true,
      data: variant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const products = await productService.getFeaturedProducts(limit);
    
    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all product brands
// @route   GET /api/products/brands
// @access  Public
export const getProductBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await productService.getProductBrands();
    
    return res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all products (only for development)
// @route   DELETE /api/products
// @access  Private/Admin
export const deleteAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Chỉ cho phép trong môi trường development
    if (process.env.NODE_ENV !== 'development') {
      throw new ValidationError('Chức năng này chỉ khả dụng trong môi trường development');
    }
    
    await productService.deleteAllProducts();
    
    return res.json({
      success: true,
      message: 'Đã xóa tất cả sản phẩm',
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 