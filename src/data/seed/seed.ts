import { envs } from '../../config/envs';
import { UserModel, CategoryModel, ProductModel, MongoDatabase } from '../mongo';
import { seedData } from './data';

(async () => {
  await MongoDatabase.connect({
    dbName: envs.MONGODB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();
  console.log('Mongo connected successfully');

  await MongoDatabase.disconnect();
  console.log('Mongo disconnected successfully');
})();

const randomBetween0AndX = (x: number) => {
  return Math.floor(Math.random() * x);
};

async function main() {
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);
  console.log('All data deleted!');

  const users = await UserModel.insertMany(seedData.users);

  const categories = await CategoryModel.insertMany(
    seedData.categories.map(category => {
      return {
        ...category,
        user: users[0]?._id,
      };
    })
  );

  await ProductModel.insertMany(
    seedData.products.map(product => {
      return {
        ...product,
        user: users[randomBetween0AndX(seedData.users.length - 1)]?._id,
        category: categories[randomBetween0AndX(seedData.categories.length - 1)]?._id,
      };
    })
  );

  console.log('SEEDED!');
}
