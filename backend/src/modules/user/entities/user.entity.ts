import { BaseEntity } from '@src/common/entities/base.entity.js';
import EUserRoles from '@src/modules/user/structures/user-roles.enum.js';
import { Exclude, Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Exclude()
export class UserEntity extends BaseEntity {
  @Expose()
  username: string;

  @Expose()
  role: EUserRoles;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Document | object) {
    super(data);
  }
}
