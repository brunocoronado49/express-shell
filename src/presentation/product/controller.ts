import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { CreateProductDto } from '../../domain/dtos/product/create-product.dto';
import { HandleErrorController } from '../helpers/handle-error';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  public getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.productService
      .getProducts(paginationDto!)
      .then(products => res.status(200).json({ products }))
      .catch(error => HandleErrorController.handleError(error, res));
  };

  public createProduct = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) return res.status(400).json({ error });

    this.productService
      .createProduct(createProductDto!)
      .then(product => res.status(201).json(product))
      .catch(error => HandleErrorController.handleError(error, res));
  };
}
