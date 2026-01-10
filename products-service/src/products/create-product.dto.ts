import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty()
  stall_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}
