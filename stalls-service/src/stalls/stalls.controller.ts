import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StallsService } from './stalls.service';

@Controller()
export class StallsController {
  constructor(private readonly stallsService: StallsService) {}

  @MessagePattern({ cmd: 'create_stall' })
  async create(@Payload() data: any) {
    return this.stallsService.create(data);
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