import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { StallsService } from './stalls.service';

@Controller()
export class StallsController {
  constructor(private readonly stallsService: StallsService) {}

  @MessagePattern({ cmd: 'create_stall' })
  async handleCreateStall(@Payload() data: any) {
    // Ahora recibimos data.user.id y data.user.role
    const { user, ...stallInfo } = data;
    
    if (user.role !== 'emprendedor') {
      throw new RpcException('Solo emprendedores pueden tener puestos');
    }

    return this.stallsService.create(stallInfo, user.id);
  }

  @MessagePattern({ cmd: 'find_all_stalls' })
  async findAll() {
    return this.stallsService.findAll();
  }

  @MessagePattern({ cmd: 'approve_stall' })
  async approve(@Payload() data: any) {
    return this.stallsService.approve(data.id);
  }

  @MessagePattern({ cmd: 'activate_stall' })
  async activate(@Payload() data: any) {
    return this.stallsService.setStatus(data.id, data.ownerId, 'activo');
  }

  @MessagePattern({ cmd: 'inactivate_stall' })
  async inactivate(@Payload() data: any) {
    return this.stallsService.setStatus(data.id, data.ownerId, 'inactivo');
  }

  @MessagePattern({ cmd: 'update_stall' })
  async update(@Payload() data: any) {
    return this.stallsService.update(data.id, data.ownerId, data.updateData);
  }
}