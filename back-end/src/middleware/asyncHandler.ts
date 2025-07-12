import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AsyncRequestHandler } from '../types/express';

/**
 * Wraps an async Express route handler to properly handle promise rejections
 * and prevent "Argument of type 'void' is not assignable to parameter of type 'RequestHandlerParams'" errors
 * 
 * @param fn The async request handler function
 * @returns A properly typed RequestHandler function
 */
const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('AsyncHandler caught error:', err);
      next(err);
    });
  };
};

export default asyncHandler; 