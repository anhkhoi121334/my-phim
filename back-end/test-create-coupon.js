const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Coupon Schema
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  minimumAmount: {
    type: Number,
    default: 0,
  },
  maximumDiscount: {
    type: Number,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: function() {
      // Default to 30 days from now
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
    default: 0,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  description: String,
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

async function createCoupon() {
  try {
    // Xóa mã giảm giá cũ nếu đã tồn tại
    await Coupon.deleteOne({ code: 'HELLONEWIBE' });
    
    // Tạo mã giảm giá mới
    const coupon = new Coupon({
      code: 'HELLONEWIBE',
      discountType: 'percentage',
      discountAmount: 10, // Giảm 10%
      minimumAmount: 1000000, // Áp dụng cho đơn hàng từ 1 triệu
      maximumDiscount: 2000000, // Giảm tối đa 2 triệu
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Hết hạn sau 3 tháng
      isActive: true,
      usageLimit: 100,
      description: 'Mã giảm giá 10% cho khách hàng mới, tối đa 2 triệu đồng'
    });

    // Lưu vào database
    await coupon.save();
    console.log('Mã giảm giá đã được tạo thành công:', coupon);
    
    // Ngắt kết nối với MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Lỗi khi tạo mã giảm giá:', error);
    mongoose.disconnect();
  }
}

// Thực thi hàm tạo mã giảm giá
createCoupon(); 