import { IsUUID, IsArray, ValidateNested, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string; // CamelCase para coincidir con Gateway

  @IsNumber()
  @Min(1)
  quantity: number;
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