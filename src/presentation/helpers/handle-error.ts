import { Response } from 'express';
import { CustomError } from '../../domain/errors/custom.error';

export class HandleErrorController {
  public static handleError(error: unknown, res: Response): Response<any, Record<string, any>> {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
