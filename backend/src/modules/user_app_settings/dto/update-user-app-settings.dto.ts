import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateUserAppSettingsDto {
  @IsOptional()
  @IsMongoId()
  activeAdsPowerAddress?: string;

  @IsOptional()
  @IsString()
  language: string;
}
