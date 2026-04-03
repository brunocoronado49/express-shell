import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeVerificationMiddleware } from '../middlewares/type-verification.middleware';

export class FileUploadRoutes {
  static get routes() {
    const router = Router();
    const fileUploadService = new FileUploadService();
    const controller = new FileUploadController(fileUploadService);

    router.use(FileUploadMiddleware.containFiles);
    router.use(TypeVerificationMiddleware.validTypes(['users', 'categories', 'products']));

    router.post('/single/:type', controller.uploadFile);
    router.post('/multiple/:type', controller.uploadMultipleFile);

    return router;
  }
}
