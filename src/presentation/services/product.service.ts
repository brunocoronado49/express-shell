import { ProductModel } from '../../data';
import { CreateProductDto } from '../../domain/dtos/product/create-product.dto';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { CustomError } from '../../domain/errors/custom.error';

export class ProductService {
  constructor() {}

  public createProduct = async (createProductDto: CreateProductDto) => {
    const productExists = await ProductModel.findOne({ name: createProductDto.name });
    if (productExists) throw CustomError.badRequest('Product already exists');

    try {
      const product = new ProductModel(createProductDto);

      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  };

  public getProducts = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user')
          .populate('category'),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        products: products,
      };
    } catch (error) {
      throw CustomError.internalServer('Internal sercver error');
    }
  };
}
