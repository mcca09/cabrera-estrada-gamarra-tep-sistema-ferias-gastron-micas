import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    enum: OrderStatus, 
    description: 'Nuevo estado del pedido', 
    example: OrderStatus.PREPARANDO 
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: 'El estado debe ser: pendiente, preparando, listo o entregado',
  })
  status: OrderStatus;
}