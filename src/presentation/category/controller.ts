import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom.error';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { CategoryService } from '../services/category.service';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private handlerError = (error: unknown, res: Response): Response<any, Record<string, any>> => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  public createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.categoryService
      .createCategory(createCategoryDto!, req.body.user)
      .then(category => res.status(201).json({ category }))
      .catch(error => this.handlerError(error, res));
  };

  public getCategories = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    this.categoryService
      .getCategories(paginationDto!)
      .then(categories => res.status(200).json({ categories }))
      .catch(error => this.handlerError(error, res));
  };
}
