import { IsUUID, IsArray, ValidateNested, IsNumber, Min, IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
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
  @IsUUID()
  @IsNotEmpty()
  customer_id: string; 

  @IsUUID()
  @IsNotEmpty()
  stall_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
