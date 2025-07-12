import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorResponse';

/**
 * Middleware xử lý lỗi 404 (Not Found)
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Không tìm thấy: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Middleware xử lý các lỗi trong ứng dụng
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Lỗi từ MongoDB - Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Trường ${field} với giá trị '${value}' đã tồn tại`;
    err = new AppError(message, 409);
  }

  // Lỗi từ MongoDB - Validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val: any) => val.message);
    const message = `Dữ liệu không hợp lệ: ${errors.join(', ')}`;
    err = new AppError(message, 400);
  }

  // Lỗi từ MongoDB - CastError (Invalid ID)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    const message = `Không tìm thấy tài nguyên với ID: ${err.value}`;
    err = new AppError(message, 404);
  }

  // Lỗi từ JWT - Invalid token
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token không hợp lệ';
    err = new AppError(message, 401);
  }

  // Lỗi từ JWT - Token expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Token đã hết hạn';
    err = new AppError(message, 401);
  }

  // Trả về response với định dạng thống nhất
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi server',
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}; 