import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { AuthService } from '../services/auth.service';
import { CustomError } from '../../domain/errors/custom.error';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handlerError = (error: unknown, res: Response): Response<any, Record<string, any>> => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  public registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authService
      .registerUser(registerUserDto!)
      .then(user => res.json(user))
      .catch(error => this.handlerError(error, res));
  };

  public loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.login(req.body);

    if (error) return res.status(400).json({ error });

    this.authService
      .loginUser(loginUserDto!)
      .then(user => res.json(user))
      .catch(error => this.handlerError(error, res));
  };

  public validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;

    this.authService
      .validateEmail(token as string)
      .then(() => res.json('Email validated successfully!!!'))
      .catch(error => this.handlerError(error, res));
  };
}
