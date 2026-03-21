import mongoose from 'mongoose';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(option: Options): Promise<boolean> {
    const { mongoUrl, dbName } = option;

    try {
      await mongoose.connect(mongoUrl, { dbName });

      return true;
    } catch (error) {
      console.log('Mongo connection error');
      throw error;
    }
  }
}
