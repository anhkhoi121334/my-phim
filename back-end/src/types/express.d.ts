import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    // Extend the Request interface to support user property
    interface Request {
      user?: {
        _id: string;
        [key: string]: any;
      };
    }
  }
}

// This type helps with the "void is not assignable to RequestHandlerParams" error
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Ensure this is treated as a module
export {}; 