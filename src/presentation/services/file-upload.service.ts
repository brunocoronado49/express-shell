import fs from 'fs';
import path from 'path';
import { UploadedFile } from 'express-fileupload';
import { UuidAdapter } from '../../config/uuid.adapter';
import { CustomError } from '../../domain/errors/custom.error';

export class FileUploadService {
  constructor(private readonly uuid = UuidAdapter.v4) {}

  private checkFolder(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  public async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['jpg', 'png', 'jpeg', 'gif', 'pdf']
  ): Promise<string | undefined> {
    try {
      const fileExtension = file.mimetype.split('/')[1] ?? '';

      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid extension: ${fileExtension} `);
      }

      const destination = path.resolve(__dirname, '../../../', folder);
      this.checkFolder(destination);

      const fileName = `${this.uuid()}.${fileExtension}`;

      file.mv(`${destination}/${fileName}`);

      return fileName;
    } catch (error) {
      throw error;
    }
  }

  public async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['jpg', 'png', 'jpeg', 'gif', 'pdf']
  ) {
    const filesUploaded = await Promise.all(
      files.map(file => this.uploadSingle(file, folder, validExtensions))
    );

    return filesUploaded;
  }
}
