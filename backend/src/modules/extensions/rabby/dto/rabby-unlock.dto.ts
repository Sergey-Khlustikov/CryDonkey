import { IsArray, IsNotEmpty } from 'class-validator';
import IBaseJobProfile from '@src/modules/projects/types/IBaseJobProfile.js';

export class RabbyUnlockDto {
  @IsArray()
  @IsNotEmpty()
  profiles: IBaseJobProfile[];
}
