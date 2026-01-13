import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StallsService } from './stalls.service';

@Controller()
export class StallsController {
  constructor(private readonly stallsService: StallsService) {}

  @MessagePattern({ cmd: 'create_stall' })
  async create(@Payload() payload: any) {
    return await this.stallsService.create(payload, payload.ownerId);
  }

  @MessagePattern({ cmd: 'find_all_stalls' })
  async findAll() {
    return await this.stallsService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_stall' })
  async findOne(@Payload() payload: { id: string }) {
    return await this.stallsService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'update_stall' })
  async update(@Payload() payload: { id: string; updateData: any; ownerId: string }) {
    return await this.stallsService.update(payload.id, payload.updateData, payload.ownerId);
  }

  @MessagePattern({ cmd: 'delete_stall' })
  async remove(@Payload() payload: { id: string; ownerId: string }) {
    return await this.stallsService.remove(payload.id, payload.ownerId);
  }

  @MessagePattern({ cmd: 'approve_stall' })
  async approve(@Payload() payload: { id: string }) {
    return await this.stallsService.approve(payload.id);
  }

  @MessagePattern({ cmd: 'activate_stall' })
  async activate(@Payload() payload: { id: string; ownerId: string }) {
    return await this.stallsService.activate(payload.id, payload.ownerId);
  }
}