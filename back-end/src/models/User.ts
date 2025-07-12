import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  name: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
  // Fields used in the application
  fullName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  postalCode?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  coupons: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>({
  name: {
    type: String,
    required: [true, 'Tên người nhận là bắt buộc'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    match: [/^(0|\+84)\d{9,10}$/, 'Số điện thoại không hợp lệ']
  },
  address: {
    type: String,
    required: [true, 'Địa chỉ chi tiết là bắt buộc'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Thành phố/Tỉnh là bắt buộc'],
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  ward: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Quốc gia là bắt buộc'],
    default: 'Việt Nam',
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  // Additional fields used in the application
  fullName: {
    type: String,
    trim: true
  },
  province: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    trim: true
  }
});

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
    maxlength: [50, 'Tên không được quá 50 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  phone: {
    type: String,
    match: [/^(0|\+84)\d{9,10}$/, 'Số điện thoại không hợp lệ']
  },
  addresses: [addressSchema],
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  coupons: [{
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Đảm bảo chỉ có một địa chỉ mặc định
userSchema.pre('save', function(next) {
  // Nếu không có địa chỉ nào, bỏ qua
  if (!this.addresses || this.addresses.length === 0) return next();
  
  // Nếu đang thêm địa chỉ mặc định mới
  const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
  
  if (defaultAddresses.length > 1) {
    // Nếu có nhiều hơn 1 địa chỉ mặc định, chỉ giữ lại địa chỉ mặc định cuối cùng
    const lastDefaultIndex = this.addresses.map(addr => addr.isDefault).lastIndexOf(true);
    
    for (let i = 0; i < this.addresses.length; i++) {
      if (i !== lastDefaultIndex && this.addresses[i].isDefault) {
        this.addresses[i].isDefault = false;
      }
    }
  }
  
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 