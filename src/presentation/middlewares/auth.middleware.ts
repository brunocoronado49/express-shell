import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../../data';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserEntity } from '../../domain/entities/user.entity';

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({ error: 'No token provider' });

    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid bearer token' });
    }

    const token: string = authorization.split(' ')[1] || '';

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(401).json({ error: 'Invalid token - user' });

      // TODO: Validate active user

      req.body.user = UserEntity.fromObject(user);

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
