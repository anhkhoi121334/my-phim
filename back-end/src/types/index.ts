import { Request } from 'express';
import { Document } from 'mongoose';

// User Types
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Product Types
export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  reviews: IReview[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

// Review Types
export interface IReview {
  user: string | IUser;
  name: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

// Order Types
export interface IOrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string | IProduct;
}

export interface IOrder {
  user: string | IUser;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

// Shipping Address
export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Payment Result
export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

// Cart Types
export interface ICartItem {
  product: string | IProduct;
  quantity: number;
}

export interface ICart {
  user: string | IUser;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Request with User
export interface AuthRequest extends Request {
  user?: IUser;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
}

export interface ICategoryTree {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  children: ICategoryTree[];
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryStats {
  total: number;
  active: number;
  inactive: number;
  parent: number;
  featured: number;
} 