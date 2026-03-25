import { Router } from 'express';
import { CategoryController } from './controller';

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoryController();

    router.get('/', controller.getCategories);
    router.get('/:id', controller.getCategoryById);
    router.post('/', controller.createCategory);
    router.put('/:id', controller.updateCategory);
    router.delete('/:id', controller.deleteCategory);

    return router;
  }
}
