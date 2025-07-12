const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create Coupon Schema
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0
  },
  minimumAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  maximumDiscount: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  usageLimit: {
    type: Number,
    required: true,
    default: 0 // 0 means unlimited
  },
  usedCount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

// Sample coupons
const sampleCoupons = [
  {
    code: 'WELCOME20',
    description: 'Giảm 20% cho đơn hàng đầu tiên',
    discountType: 'percentage',
    discountAmount: 20,
    minimumAmount: 100000, // 100,000 VND
    maximumDiscount: 200000, // 200,000 VND
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    isActive: true,
    usageLimit: 0,
    usedCount: 0
  },
  {
    code: 'SUMMER2023',
    description: 'Giảm 15% cho mùa hè 2023',
    discountType: 'percentage',
    discountAmount: 15,
    minimumAmount: 200000, // 200,000 VND
    maximumDiscount: 300000, // 300,000 VND
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    isActive: true,
    usageLimit: 100,
    usedCount: 0
  },
  {
    code: 'FLAT50K',
    description: 'Giảm 50,000đ cho đơn hàng từ 500,000đ',
    discountType: 'fixed',
    discountAmount: 50000, // 50,000 VND
    minimumAmount: 500000, // 500,000 VND
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    isActive: true,
    usageLimit: 50,
    usedCount: 0
  },
  {
    code: 'NEWUSER',
    description: 'Giảm 10% cho khách hàng mới',
    discountType: 'percentage',
    discountAmount: 10,
    minimumAmount: 0, // No minimum
    maximumDiscount: 100000, // 100,000 VND
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    isActive: true,
    usageLimit: 0,
    usedCount: 0
  }
];

// Create coupons
const createSampleCoupons = async () => {
  try {
    // Delete existing coupons
    await Coupon.deleteMany({});
    console.log('Deleted existing coupons');
    
    // Insert new coupons
    const createdCoupons = await Coupon.insertMany(sampleCoupons);
    console.log(`Created ${createdCoupons.length} sample coupons:`);
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code}: ${coupon.description}`);
    });
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating sample coupons:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

createSampleCoupons(); 