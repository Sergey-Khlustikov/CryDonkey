import EUserRoles from '@src/modules/user/structures/user-roles.enum.js';

export interface IAuthUser {
  _id: string;
  username: string;
  role: EUserRoles;
}
