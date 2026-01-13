import { IsEmail, IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsEnum(Role, { message: 'El rol proporcionado no es válido' })
  role?: Role;
}