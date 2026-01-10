import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: any) {
    const { email } = data;
    const existingUser = await this.usersService.findOneByEmail(email);
    
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const newUser = await this.usersService.create(data);
    
    const payload = { 
      sub: newUser.id, 
      email: newUser.email, 
      role: newUser.role 
    };

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(data: any) {
    const { email, password } = data;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getProfile(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateProfile(id: string, updateData: any) {
    return this.usersService.update(id, updateData);
  }
}