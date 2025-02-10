import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

declare module 'express-serve-static-core' {
  interface Request {
    authUser?: IAuthUser;
  }
}
