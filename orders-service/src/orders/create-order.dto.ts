import { IsUUID, IsArray, ValidateNested, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unit_price: number;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customer_id: string; // El Gateway mapeará req.user.id aquí

  @IsUUID()
  @IsNotEmpty()
  stall_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
