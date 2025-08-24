import { IsArray, IsNotEmpty } from 'class-validator';
import { IBaseJobProfile } from '@crydonkey/shared';

export class RabbyUnlockDto {
  @IsArray()
  @IsNotEmpty()
  profiles: IBaseJobProfile[];
}
