/**
 * Lớp lỗi tùy chỉnh cho ứng dụng
 * Giúp xử lý lỗi một cách nhất quán và cung cấp thông tin chi tiết hơn
 */

/**
 * Lớp lỗi cơ bản cho ứng dụng
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Lỗi khi không tìm thấy tài nguyên (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Không tìm thấy tài nguyên') {
    super(message, 404);
  }
}

/**
 * Lỗi khi xác thực thất bại (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Xác thực thất bại') {
    super(message, 401);
  }
}

/**
 * Lỗi khi không có quyền truy cập (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Không có quyền truy cập') {
    super(message, 403);
  }
}

/**
 * Lỗi khi dữ liệu đầu vào không hợp lệ (400)
 */
export class ValidationError extends AppError {
  errors: any[];

  constructor(message: string = 'Dữ liệu không hợp lệ', errors: any[] = []) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Lỗi khi có xung đột dữ liệu (409)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Xung đột dữ liệu') {
    super(message, 409);
  }
}

/**
 * Lỗi khi có vấn đề với thanh toán (402)
 */
export class PaymentError extends AppError {
  constructor(message: string = 'Lỗi thanh toán') {
    super(message, 402);
  }
}

/**
 * Lỗi khi có vấn đề với dịch vụ bên thứ ba (502)
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Dịch vụ không khả dụng') {
    super(message, 502);
  }
} 