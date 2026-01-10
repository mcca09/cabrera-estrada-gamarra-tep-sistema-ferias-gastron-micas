import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() data: any) {
    try {
      return await this.authService.register(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: any) {
    try {
      return await this.authService.login(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'get_profile' })
  async getProfile(@Payload() data: any) {
    const userId = data?.id || data?.userId;
    if (!userId) throw new RpcException('ID de usuario no proporcionado');
    return this.authService.getProfile(userId);
  }
}