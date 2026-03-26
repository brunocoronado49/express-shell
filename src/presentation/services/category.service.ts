import { CategoryModel } from '../../data';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';

export class CategoryService {
  constructor() {}

  public async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
    if (categoryExists) throw CustomError.badRequest('Category already exists');

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer('Internal server error');
    }
  }

  public getCategories = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;

    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        categories: categories.map(category => {
          return {
            id: category.id,
            name: category.name,
            available: category.available,
          };
        }),
      };
    } catch (error) {
      throw CustomError.internalServer('Internal server error');
    }
  };
}
