import { UserModel } from '../../data';
import { JwtAdapter } from '../../config/jwt.adapter';
import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { EmailService } from './email.service';
import { envs } from '../../config/envs';

interface UserData {
  id: string;
  name: string;
  email: string;
  emailValidated: boolean;
  role: string[];
  img?: string | undefined;
}

interface UserAuthData {
  user: UserData;
  token: {};
}

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto): Promise<UserAuthData> {
    const existsUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existsUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer('Error while create JWT');

      return {
        user: userEntity,
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto): Promise<UserAuthData> {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.notFound('Email user not found');

    const passMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!passMatch) throw CustomError.unauthorized('Password not valid');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
    if (!token) throw CustomError.internalServer('Error while create JWT');

    return {
      user: userEntity,
      token: token,
    };
  }

  private sendEmailValidationLink = async (email: string): Promise<boolean> => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  };

  public validateEmail = async (token: string): Promise<boolean> => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Token not valid');

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer('Email not exists');

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
