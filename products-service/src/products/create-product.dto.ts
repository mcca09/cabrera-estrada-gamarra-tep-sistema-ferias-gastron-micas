import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID, Min, IsOptional, IsBoolean } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsBoolean()
  @IsOptional()
  is_available: boolean;
}
