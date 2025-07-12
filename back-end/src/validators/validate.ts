/**
 * Middleware xử lý kết quả validation từ express-validator
 */
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errorResponse';

/**
 * Middleware factory để xử lý kết quả validation
 * Sử dụng sau các validators của express-validator
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Thực thi tất cả các validation
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Kiểm tra kết quả
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map(err => {
        let field = 'unknown';
        if (err.type === 'field') {
          field = err.path;
        }
        
        return {
          field,
          message: err.msg
        };
      });
      
      throw new ValidationError('Dữ liệu không hợp lệ', extractedErrors);
    }
    
    next();
  };
}; 