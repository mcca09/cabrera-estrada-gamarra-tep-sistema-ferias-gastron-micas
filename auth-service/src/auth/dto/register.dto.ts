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