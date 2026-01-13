import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID, Min, IsOptional, IsBoolean, IsEmpty } from 'class-validator';

export class UpdateStallDto {
   
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEmpty({ message: 'No puedes actualizar el ownerId manualmente' }) 
    ownerId?: string;

    @IsEmpty({ message: 'No puedes actualizar el status manualmente' })
    status?: string;
}
