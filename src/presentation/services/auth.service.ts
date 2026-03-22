import { UserModel } from '../../data';
import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { JwtAdapter } from '../../config/jwt.adapter';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existsUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existsUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // JWT

      // Verification email

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { user: userEntity, token: 'ABC' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.notFound('Email user not found');

    const passMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!passMatch) throw CustomError.unauthorized('Password not valid');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
    if (!token) throw CustomError.internalServer('Error while create JWT');

    return {
      useer: userEntity,
      token: token,
    };
  }
}
