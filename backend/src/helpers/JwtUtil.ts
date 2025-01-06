import jwt, {JwtPayload} from 'jsonwebtoken';
import ENV from "#src/structures/env.js";

const JWT_SECRET = ENV.JWT_SECRET;
const TTL = '14d';

export class JwtUtil {
  static generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: TTL});
  }

  static verifyToken(token: string): string | JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
