import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register_user' })
  async register(@Payload() data: any) {
    try {
      return await this.authService.register(data);
    } catch (error) {
      throw new RpcException({ message: error.message, status: error.status || 400 });
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: any) {
    try {
      return await this.authService.login(data);
    } catch (error) {
      throw new RpcException({ message: error.message, status: error.status || 401 });
    }
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll() {
    try {
      return await this.authService.findAllUsers();
    } catch (error) {
      throw new RpcException({ message: error.message, status: 500 });
    }
  }

  @MessagePattern({ cmd: 'get_profile' })
  async getProfile(@Payload() data: any) {
    try {
      const userId = data?.id || data?.userId;
      if (!userId) throw new Error('ID de usuario no proporcionado');
      return await this.authService.getProfile(userId);
    } catch (error) {
      throw new RpcException({ message: error.message, status: 404 });
    }
  }

  @MessagePattern({ cmd: 'update_profile' })
  async updateProfile(@Payload() data: any) {
    try {
      return await this.authService.updateProfile(data.id, data.updateData);
    } catch (error) {
      throw new RpcException({ message: error.message, status: error.status || 400 });
    }
  }

  @MessagePattern({ cmd: 'delete_profile' })
  async deleteProfile(@Payload() data: any) {
    try {
      return await this.authService.deleteProfile(data.id);
    } catch (error) {
      throw new RpcException({ message: error.message, status: error.status || 400 });
    }
  }
}