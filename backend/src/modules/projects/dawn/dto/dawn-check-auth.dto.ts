import { IsArray, IsNotEmpty } from 'class-validator';
import { IBaseJobProfile } from '@crydonkey/shared';

export class DawnCheckAuthDto {
  @IsArray()
  @IsNotEmpty()
  profiles: IBaseJobProfile[];
}
