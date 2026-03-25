import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom.error';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';

export class CategoryController {
  constructor() {}

  private handlerError = (error: unknown, res: Response): Response<any, Record<string, any>> => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  public createCategory = async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    return res.json(createCategoryDto);
  };

  public getCategories = async (req: Request, res: Response) => {
    res.json('Get All categories');
  };

  public getCategoryById = async (req: Request, res: Response) => {
    res.json('Get One category by id');
  };

  public updateCategory = async (req: Request, res: Response) => {
    res.json('Update category');
  };

  public deleteCategory = async (req: Request, res: Response) => {
    res.json('Delete category');
  };
}
