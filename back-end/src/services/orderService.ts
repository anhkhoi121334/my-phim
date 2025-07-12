import { Types } from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import { ValidationError, NotFoundError, AppError, AuthenticationError, ForbiddenError, ConflictError, PaymentError, ServiceUnavailableError } from '../utils/errorResponse';

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country?: string;
}

interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

interface CreateOrderData {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number | string;
  taxPrice: number | string;
  shippingPrice: number | string;
  totalPrice: number | string;
  discountAmount?: number | string;
  couponCode?: string;
}

/**
 * Create a new order
 */
export const createOrder = async (userId: string, orderData: CreateOrderData) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discountAmount = 0,
    couponCode
  } = orderData;

  // Validate required fields
  if (!orderItems || orderItems.length === 0) {
    throw new AppError('Không có sản phẩm nào trong đơn hàng', 400);
  }

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
    throw new AppError('Thiếu thông tin địa chỉ giao hàng', 400);
  }

  if (!paymentMethod) {
    throw new AppError('Thiếu phương thức thanh toán', 400);
  }

  // Kiểm tra xem có sản phẩm nào không có ID hợp lệ
  const invalidProducts = orderItems.filter(item => !item.product || typeof item.product !== 'string' || item.product.trim() === '');
  if (invalidProducts.length > 0) {
    throw new AppError(`Có ${invalidProducts.length} sản phẩm không có ID hợp lệ`, 400);
  }

  // Kiểm tra xem sản phẩm có tồn tại trong database không
  const productIds = orderItems.map(item => item.product);
  const existingProducts = await Product.find({ _id: { $in: productIds } });
  
  if (existingProducts.length !== productIds.length) {
    // Tìm các sản phẩm không tồn tại
    const existingProductIds = existingProducts.map(p => p._id.toString());
    const nonExistingProductIds = productIds.filter(id => !existingProductIds.includes(id.toString()));
    
    throw new AppError(`Có ${nonExistingProductIds.length} sản phẩm không tồn tại trong hệ thống`, 400);
  }

  // Xử lý dữ liệu đầu vào để đảm bảo không có null/undefined
  const sanitizedOrderItems = orderItems.map(item => ({
    name: item.name || 'Sản phẩm không tên',
    quantity: item.quantity || 1,
    image: item.image || 'https://via.placeholder.com/150',
    price: parseFloat(item.price.toString()) || 0,
    product: item.product
  }));

  const order = new Order({
    orderItems: sanitizedOrderItems,
    user: userId,
    shippingAddress: {
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country || 'Vietnam'
    },
    paymentMethod,
    itemsPrice: parseFloat(itemsPrice.toString()) || 0,
    taxPrice: parseFloat(taxPrice.toString()) || 0,
    shippingPrice: parseFloat(shippingPrice.toString()) || 0,
    discountAmount: parseFloat(discountAmount.toString()) || 0,
    totalPrice: parseFloat(totalPrice.toString()) || 0,
    couponCode: couponCode || undefined
  });

  const createdOrder = await order.save();
  return createdOrder;
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string) => {
  const order = await Order.findById(orderId).populate('user', 'name email');

  if (!order) {
    throw new AppError('Đơn hàng không tìm thấy', 404);
  }

  return order;
};

/**
 * Update order to paid status
 */
export const updateOrderToPaid = async (orderId: string, paymentResult: PaymentResult) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Đơn hàng không tìm thấy', 404);
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: paymentResult.id,
    status: paymentResult.status,
    update_time: paymentResult.update_time,
    email_address: paymentResult.email_address
  };

  const updatedOrder = await order.save();
  return updatedOrder;
};

/**
 * Get orders for a specific user
 */
export const getUserOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId });
  return orders;
};

/**
 * Get all orders (admin)
 */
export const getAllOrders = async () => {
  const orders = await Order.find({}).populate('user', 'id name');
  return orders;
};

/**
 * Update order to delivered status
 */
export const updateOrderToDelivered = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Đơn hàng không tìm thấy', 404);
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  const updatedOrder = await order.save();
  return updatedOrder;
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Đơn hàng không tìm thấy', 404);
  }

  // Only allow cancellation if order is not paid and not delivered
  if (order.isPaid) {
    throw new AppError('Không thể hủy đơn hàng đã thanh toán', 400);
  }

  if (order.isDelivered) {
    throw new AppError('Không thể hủy đơn hàng đã giao', 400);
  }

  order.isCancelled = true;
  order.cancelledAt = new Date();

  const updatedOrder = await order.save();
  return updatedOrder;
}; 