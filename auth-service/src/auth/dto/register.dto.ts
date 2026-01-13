/*
import { Role } from '../enums/role.enum';

// Aquí no es estrictamente necesario class-validator si el Gateway ya validó,
// pero se recomienda para mantener la integridad del dominio.
export class RegisterUserDto {
  email: string;
  password: string;
  fullName: string;
  role: Role;
}
*/

import { IsEmail, IsString, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(Role)
  role: Role;
}