import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: mongoose.Types.ObjectId;
}

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
  method?: string;
  transaction_id?: string;
  payment_provider?: string;
  raw_response?: any;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountAmount: number;
  couponCode?: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  isCancelled: boolean;
  cancelledAt?: Date;
  orderCode?: string;
}

const orderItemSchema = new Schema<IOrderItem>({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const paymentResultSchema = new Schema<IPaymentResult>({
  id: {
    type: String
  },
  status: {
    type: String
  },
  update_time: {
    type: String
  },
  email_address: {
    type: String
  },
  method: {
    type: String
  },
  transaction_id: {
    type: String
  },
  payment_provider: {
    type: String
  },
  raw_response: {
    type: Schema.Types.Mixed
  }
});

const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['PayPal', 'Stripe', 'Cash on Delivery', 'MoMo', 'QuickPay']
  },
  paymentResult: paymentResultSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discountAmount: {
    type: Number,
    required: true,
    default: 0.0
  },
  couponCode: {
    type: String
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  isCancelled: {
    type: Boolean,
    required: true,
    default: false
  },
  cancelledAt: {
    type: Date
  },
  orderCode: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema); 