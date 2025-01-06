import {NextFunction, Request, Response} from "express";
import {JwtUtil} from "#src/helpers/JwtUtil.js";
import {createNamespace} from 'cls-hooked';

const authNamespace = createNamespace('auth');

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({message: 'Access denied'});
    return;
  }

  try {
    authNamespace.run(() => {
      const user = JwtUtil.verifyToken(token);
      req.authUser = user;
      authNamespace.set('authUser', user);
      next();
    });
  } catch (err) {
    res.status(401).json({message: 'Invalid auth token', error: err});
    return;
  }
}

export function getAuthUser() {
  return authNamespace.get('authUser');
}
