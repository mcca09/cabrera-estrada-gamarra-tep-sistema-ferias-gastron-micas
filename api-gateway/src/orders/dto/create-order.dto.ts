import { IsUUID, IsArray, ValidateNested, IsNumber, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// 1. Validamos primero el objeto de cada item individual
export class CreateOrderItemDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'ID del producto' })
  @IsNotEmpty()
  @IsUUID('4', { message: 'El productId debe ser un UUID válido' })
  productId: string;

  @ApiProperty({ example: 2, description: 'Cantidad de productos', minimum: 1 })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity: number;

  @ApiProperty({ example: 15.50, description: 'Precio unitario al momento de compra' })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @ApiProperty({ example: 'b11e8400-e29b-41d4-a716-446655441111', description: 'ID del puesto (Stall)' })
  @IsNotEmpty()
  @IsUUID('4', { message: 'El stallId debe ser un UUID válido' })
  stallId: string;
}

// 2. Validamos la orden completa
export class CreateOrderDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID del cliente' })
  @IsNotEmpty()
  @IsUUID('4', { message: 'El customer_id debe ser un UUID válido' })
  customer_id: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto dentro del array
  @Type(() => CreateOrderItemDto) // Convierte el JSON a la clase CreateOrderItemDto
  items: CreateOrderItemDto[];
}
