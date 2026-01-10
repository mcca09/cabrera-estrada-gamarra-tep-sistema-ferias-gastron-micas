import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StallsService } from './stalls.service';

@Controller()
export class StallsController {
  constructor(private readonly stallsService: StallsService) {}

  @MessagePattern({ cmd: 'create_stall' })
  async create(@Payload() data: any) {
    // El Gateway envía 'ownerId', mapeamos a lo que espera tu Service
    const { ownerId, ...dto } = data;
    return this.stallsService.create({ owner_id: ownerId, ...dto });
  }

  @MessagePattern({ cmd: 'get_all_stalls' }) // Corregido cmd
  async findAll() {
    return this.stallsService.findAll();
  }

  @MessagePattern({ cmd: 'get_stall_by_id' }) // Corregido cmd
  async findOne(@Payload() data: any) {
    const id = data.id || data;
    return this.stallsService.findOne(id); // Eliminado Number()
  }
}