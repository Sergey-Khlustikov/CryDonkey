import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import EUserRoles from '@src/modules/user/structures/user-roles.enum.js';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsEnum(EUserRoles)
  role: EUserRoles;
}
