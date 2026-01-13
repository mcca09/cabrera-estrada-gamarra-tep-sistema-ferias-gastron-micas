import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateStallDto {
  @IsUUID()
  @IsNotEmpty({ message: 'El ID del propietario es obligatorio' })
  ownerId: string; // Cambiado para coincidir con el envío del Gateway

  @IsString()
  @IsNotEmpty({ message: 'El nombre del puesto es obligatorio' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}