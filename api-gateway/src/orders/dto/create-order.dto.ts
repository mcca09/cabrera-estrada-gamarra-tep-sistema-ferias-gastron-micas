import { IsUUID, IsArray, ValidateNested, IsNumber, Min, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  // 👇 CAMBIO CLAVE: Usamos @IsOptional()
  // Esto permite que Postman NO envíe este campo, pero Typescript sepa que existe.
  @ApiProperty({ required: false })
  @IsOptional() 
  customer_id?: string; 

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  stall_id: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]; 
}