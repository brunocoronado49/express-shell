import { NextFunction, Request, Response } from 'express';

export class TypeVerificationMiddleware {
  static validTypes(validTypes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const type = req.url.split('/')[2] ?? '';

      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({ error: `Invalid type: ${type}. Should be: users, categories, products` });
      }

      next();
    };
  }
}
