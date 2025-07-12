import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  banner?: string;
  parentId?: mongoose.Types.ObjectId;
  level: number;
  isActive: boolean;
  isFeature?: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
  subcategories?: ICategory[];
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Tên danh mục là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên danh mục không được quá 100 ký tự']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  image: {
    type: String
  },
  icon: {
    type: String
  },
  banner: {
    type: String
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: [0, 'Level không được nhỏ hơn 0']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeature: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
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
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// Virtual for products count
categorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', async function(next) {
  // Generate slug from name if not provided
  if (!this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check if slug already exists and add number if needed
    let slug = baseSlug;
    let counter = 1;
    
    while (await mongoose.model('Category').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  // Set level based on parent
  if (this.parentId) {
    this.level = 1;
  } else {
    this.level = 0;
  }
  
  next();
});

export default mongoose.model<ICategory>('Category', categorySchema); 