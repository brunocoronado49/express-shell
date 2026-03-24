import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { envs } from '../../config/envs';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService({
      mailerService: envs.MAILER_SERVICE,
      mailerEmail: envs.MAILER_EMAIL,
      mailerSecretKey: envs.MAILER_SECRET_KEY,
    });
    const authServise = new AuthService(emailService);
    const controller = new AuthController(authServise);

    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);

    return router;
  }
}
