import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED: string = envs.JWT_SEED;

export class JwtAdapter {
  static async generateToken(payload: any, duration: any = '2h') {
    return new Promise(resolve => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);

        resolve(token);
      });
    });
  }

  static validateToken(token: string): any {
    // TODO: validate token and email
    return;
  }
}
