import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  attributes: Record<string, any>; // Màu sắc, kích thước, v.v.
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
}

export interface IProductSpecification {
  category: string; // CPU, RAM, GPU, Storage, etc.
  name: string;
  value: string;
  unit?: string;
  isHighlighted?: boolean;
}

export interface IProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface IProductShippingInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  freeShipping: boolean;
  shippingCost: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  brand: string;
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  mainImage: string;
  images: string[];
  variants: IProductVariant[];
  specifications: IProductSpecification[];
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  stock?: number;
  averageRating: number;
  numReviews: number;
  reviews: IReview[];
  tags: string[];
  warranty?: string;
  returnPolicy?: string;
  shippingInfo?: IProductShippingInfo;
  seo?: IProductSEO;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productVariantSchema = new Schema<IProductVariant>({
  sku: {
    type: String,
    required: [true, 'SKU là bắt buộc'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Tên biến thể là bắt buộc'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Giá biến thể là bắt buộc'],
    min: [0, 'Giá không được âm']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Giá gốc không được âm']
  },
  stock: {
    type: Number,
    required: [true, 'Số lượng tồn kho là bắt buộc'],
    min: [0, 'Số lượng tồn kho không được âm'],
    default: 0
  },
  images: [{
    type: String
  }],
  attributes: {
    type: Schema.Types.Mixed
  },
  weight: {
    type: Number,
    min: [0, 'Trọng lượng không được âm']
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const productSpecificationSchema = new Schema<IProductSpecification>({
  category: {
    type: String,
    required: [true, 'Danh mục thông số là bắt buộc'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Tên thông số là bắt buộc'],
    trim: true
  },
  value: {
    type: String,
    required: [true, 'Giá trị thông số là bắt buộc'],
    trim: true
  },
  unit: {
    type: String,
    trim: true
  },
  isHighlighted: {
    type: Boolean,
    default: false
  }
});

const productSEOSchema = new Schema<IProductSEO>({
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title không được quá 60 ký tự']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description không được quá 160 ký tự']
  },
  keywords: [{
    type: String,
    trim: true
  }]
});

const productShippingInfoSchema = new Schema<IProductShippingInfo>({
  weight: {
    type: Number,
    required: [true, 'Trọng lượng là bắt buộc'],
    min: [0, 'Trọng lượng không được âm']
  },
  dimensions: {
    length: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 }
  },
  freeShipping: {
    type: Boolean,
    default: false
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: [0, 'Phí vận chuyển không được âm']
  }
});

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên sản phẩm không được quá 200 ký tự']
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Mô tả sản phẩm là bắt buộc'],
    trim: true
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Mô tả ngắn không được quá 300 ký tự'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Thương hiệu là bắt buộc'],
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Danh mục là bắt buộc']
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  mainImage: {
    type: String,
    required: [true, 'Hình ảnh chính là bắt buộc']
  },
  images: [{
    type: String
  }],
  variants: [productVariantSchema],
  specifications: [productSpecificationSchema],
  basePrice: {
    type: Number,
    required: [true, 'Giá cơ bản là bắt buộc'],
    min: [0, 'Giá không được âm']
  },
  minPrice: {
    type: Number,
    default: 0,
    min: [0, 'Giá tối thiểu không được âm']
  },
  maxPrice: {
    type: Number,
    default: 0,
    min: [0, 'Giá tối đa không được âm']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Số lượng tồn kho không được âm']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Số đánh giá không được âm']
  },
  reviews: [reviewSchema],
  tags: [{
    type: String,
    trim: true
  }],
  warranty: {
    type: String,
    trim: true
  },
  returnPolicy: {
    type: String,
    trim: true
  },
  shippingInfo: productShippingInfoSchema,
  seo: productSEOSchema,
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for category info
productSchema.virtual('categoryInfo', {
  ref: 'Category',
  localField: 'category',
  foreignField: '_id',
  justOne: true
});

// Virtual for subcategory info
productSchema.virtual('subCategoryInfo', {
  ref: 'Category',
  localField: 'subCategory',
  foreignField: '_id',
  justOne: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ 'variants.sku': 1 });
productSchema.index({ tags: 1 });
productSchema.index({ minPrice: 1, maxPrice: 1 });

// Pre-save middleware to calculate min/max prices
productSchema.pre('save', function(next) {
  if (this.variants && this.variants.length > 0) {
    const prices = this.variants
      .filter(v => v.isActive)
      .map(v => v.price);
    
    if (prices.length > 0) {
      this.minPrice = Math.min(...prices);
      this.maxPrice = Math.max(...prices);
    }
  } else {
    this.minPrice = this.basePrice;
    this.maxPrice = this.basePrice;
  }
  
  next();
});

// Pre-save middleware to generate slug from name
productSchema.pre('save', async function(next) {
  if (this.isModified('name') || this.isNew) {
    try {
      // Generate slug from name
      let slug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      // If slug is empty, use a default
      if (!slug) {
        slug = 'product-' + Date.now();
      }
      
      // Check if slug already exists (for uniqueness)
      const Product = this.constructor as any;
      const existingProduct = await Product.findOne({ slug: slug, _id: { $ne: this._id } });
      
      if (existingProduct) {
        // If slug exists, append a number
        slug = slug + '-' + Date.now();
      }
      
      this.slug = slug;
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.variants && this.variants.length > 0) {
    const variant = this.variants.find(v => v.originalPrice && v.originalPrice > v.price);
    if (variant && variant.originalPrice) {
      return Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100);
    }
  }
  return 0;
});

// Method to get total stock
productSchema.methods.getTotalStock = function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants
      .filter((v: IProductVariant) => v.isActive)
      .reduce((total: number, variant: IProductVariant) => total + variant.stock, 0);
  }
  return 0;
};

export default mongoose.model<IProduct>('Product', productSchema); 