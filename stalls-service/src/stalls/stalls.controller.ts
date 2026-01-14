import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StallsService } from './stalls.service';
import { CreateStallDto } from './create-stall.dto';
import { UpdateStallPayload } from './update-stall-payload.dto';

@Controller()
export class StallsController {
  constructor(private readonly stallsService: StallsService) {}

  @MessagePattern({ cmd: 'create_stall' })
async create(@Payload() dto: CreateStallDto) {
  return this.stallsService.create(dto);
}


  @MessagePattern({ cmd: 'verify_stall_ownership' })
  async validateAccess(@Payload() data: { userId: string; stall_id: string }) {
    const { userId, stall_id } = data;
    return this.stallsService.validateAccess(userId, stall_id);
  }

  @MessagePattern({ cmd: 'get_active_stalls' })
  async findActive() {
    return await this.stallsService.findActive();
  }

  @MessagePattern({ cmd: 'get_stalls_by_owner' })
  async findByOwner(@Payload() data: { ownerId: string }) {
    return await this.stallsService.findByOwner(data.ownerId);
  }

  @MessagePattern({ cmd: 'find_one_stall_owner' })
  async findOneByOwner(@Payload() data: { id: string, ownerId: string }) {
    return await this.stallsService.findOneByOwner(data.id, data.ownerId);
  }
  
  @MessagePattern({ cmd: 'update_stall' })
  async update(@Payload() payload: any) {
    const { id, ownerId, updateData } = payload; 
    
    return await this.stallsService.update(id, ownerId, updateData);
  }

  @MessagePattern({ cmd: 'delete_stall' })
  async remove(@Payload() payload: { id: string; ownerId: string }) {
    return await this.stallsService.remove(payload.id, payload.ownerId);
  }

  @MessagePattern({ cmd: 'approve_stall' })
  async approve(@Payload() payload: { id: string }) {
    return await this.stallsService.approve(payload.id);
  }

  @MessagePattern({ cmd: 'disapprove_stall' })
  async disapprove(@Payload() payload: { id: string }) {
    return await this.stallsService.disapprove(payload.id);
  }

  @MessagePattern({ cmd: 'activate_stall' })
  async activate(@Payload() payload: { id: string; ownerId: string }) {
    return await this.stallsService.activate(payload.id, payload.ownerId);
  }

  @MessagePattern({ cmd: 'inactivate_stall' })
  async inactivate(@Payload() payload: { id: string; ownerId: string }) {
    return await this.stallsService.inactivate(payload.id, payload.ownerId);
  }
}  
