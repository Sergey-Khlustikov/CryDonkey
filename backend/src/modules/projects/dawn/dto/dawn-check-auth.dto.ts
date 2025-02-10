import IBaseJobProfile from '@src/modules/projects/types/IBaseJobProfile.js';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DawnCheckAuthDto {
  @IsArray()
  @IsNotEmpty()
  profiles: IBaseJobProfile[];
}
