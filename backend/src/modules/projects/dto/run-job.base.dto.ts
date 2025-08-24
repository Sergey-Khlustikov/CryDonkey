import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IBaseJobProfile } from '@crydonkey/shared';

export class RunJobBaseDto {
  @IsArray()
  @IsNotEmpty()
  profiles: IBaseJobProfile[];

  @IsNumber()
  minDelayMinutes: number;

  @IsNumber()
  maxDelayMinutes: number;

  @IsArray()
  @IsString({ each: true })
  keepOpenProfileIds: string[];
}
