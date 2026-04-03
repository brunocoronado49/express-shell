import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { FileUploadService } from '../services/file-upload.service';
import { HandleErrorController } from '../helpers/handle-error';

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  public uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const file = req.body.files[0] as UploadedFile;

    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then(uploaded => res.json({ uploaded }))
      .catch(error => HandleErrorController.handleError(error, res));
  };

  public uploadMultipleFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then(uploaded => res.json({ uploaded }))
      .catch(error => HandleErrorController.handleError(error, res));
  };

  public getImage = (req: Request, res: Response) => {
    res.json('Get image');
  };
}
