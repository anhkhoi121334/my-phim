import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware kiểm tra quyền truy cập của người dùng dựa trên vai trò (role)
 * @param roles Danh sách các vai trò được phép truy cập
 */
export const authorize = 
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập tài nguyên này',
      });
    }

    return next();
  }; 