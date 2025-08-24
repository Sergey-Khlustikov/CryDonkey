import type EUserRoles from 'src/domains/user/structures/user-roles.enum.js';

export interface IUser {
  id: string;
  username: string;
  role: EUserRoles;
  createdAt: string;
  updatedAt: string;
}
