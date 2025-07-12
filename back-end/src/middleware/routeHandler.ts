import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AsyncRequestHandler } from '../types/express';

/**
 * A wrapper function to properly type Express route handlers.
 * This addresses the TypeScript error: "Argument of type 'void' is not assignable to parameter of type 'RequestHandlerParams'"
 * that occurs with async functions in Express routes.
 */
export const routeHandler = (handler: AsyncRequestHandler | RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = handler(req, res, next);
      
      if (result instanceof Promise) {
        result.catch((err) => {
          console.error('RouteHandler caught error:', err);
          next(err);
        });
      }
    } catch (err) {
      console.error('RouteHandler caught synchronous error:', err);
      next(err);
    }
  };
}; 