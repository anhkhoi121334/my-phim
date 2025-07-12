import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  order: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề banner'],
      trim: true,
      maxlength: [100, 'Tiêu đề không được vượt quá 100 ký tự'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Vui lòng cung cấp đường dẫn hình ảnh'],
      trim: true,
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Vui lòng chọn vị trí hiển thị'],
      enum: {
        values: ['home_main', 'home_secondary', 'category_page', 'product_page', 'sidebar', 'popup'],
        message: 'Vị trí không hợp lệ',
      },
      default: 'home_main',
    },
    order: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
BannerSchema.index({ position: 1, order: 1 });
BannerSchema.index({ isActive: 1 });

// Check if banner is active based on dates
BannerSchema.virtual('isCurrentlyActive').get(function(this: IBanner) {
  const now = new Date();
  
  // If banner is not active in general, return false
  if (!this.isActive) return false;
  
  // Check start date
  if (this.startDate && this.startDate > now) return false;
  
  // Check end date
  if (this.endDate && this.endDate < now) return false;
  
  return true;
});

// Always include virtuals
BannerSchema.set('toJSON', { virtuals: true });
BannerSchema.set('toObject', { virtuals: true });

export default mongoose.model<IBanner>('Banner', BannerSchema); 