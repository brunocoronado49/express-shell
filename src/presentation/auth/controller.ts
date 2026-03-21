import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { AuthService } from '../services/auth.service';
import { CustomError } from '../../domain/errors/custom.error';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handlerError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authService
      .registerUser(registerUserDto!)
      .then(user => res.json(user))
      .catch(error => this.handlerError(error, res));
  };

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.login(req.body);

    if (error) return res.status(400).json({ error });

    this.authService
      .loginUser(loginUserDto!)
      .then(user => res.json(user))
      .catch(error => this.handlerError(error, res));
  };

  validateEmail = async (req: Request, res: Response): Promise<void> => {
    res.json('validateEmail');
  };
}
