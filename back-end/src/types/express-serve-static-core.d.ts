// This augmentation solves the "Argument of type 'void' is not assignable to parameter 
// of type 'RequestHandlerParams'" error with Express

import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }
} 