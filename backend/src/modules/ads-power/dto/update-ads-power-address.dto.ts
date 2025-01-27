import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateAdsPowerAddressDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  host: string;

  @IsNotEmpty()
  @IsNumber()
  port: number;
}
