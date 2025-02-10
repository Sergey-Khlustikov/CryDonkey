import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAdsPowerAddressDto {
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
