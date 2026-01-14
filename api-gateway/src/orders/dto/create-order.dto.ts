import { IsUUID, IsArray, ValidateNested, IsNumber, IsInt, Min, IsNotEmpty, IsOptional, IsEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string; 

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity: number;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number; 
}

export class CreateOrderDto {
  @IsEmpty ()
  @IsUUID()
  customer_id?: string;

  @IsNotEmpty()
  @IsUUID()
  stall_id: string;

  @IsArray()
  @IsNotEmpty({ message: 'La orden debe contener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}