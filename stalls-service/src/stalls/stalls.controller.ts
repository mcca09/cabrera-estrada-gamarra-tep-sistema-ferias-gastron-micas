import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StallsService } from './stalls.service';

@Controller()
export class StallsController {
  constructor(private readonly stallsService: StallsService) {}

  @MessagePattern({ cmd: 'create_stall' })
  async create(@Payload() data: any) {
    const { ownerId, ...dto } = data;
    return this.stallsService.create({ ownerId, ...dto });
  }

  @MessagePattern({ cmd: 'verify_stall_ownership' })
  async validateAccess(@Payload() data: { userId: string; stall_id: string }): Promise<{ valid: boolean; message?: string }> {
    const { userId, stall_id } = data;
  
    const stall = await this.stallsService.findOne(stall_id);
  
      if (!stall) {
        return { valid: false, message: 'El puesto no existe.' };
      }

      if (stall.ownerId !== userId) {
        return { valid: false, message: 'No eres el dueño de este puesto.' };
      }
    return { valid: true };
  }

  @MessagePattern({ cmd: 'verify_stall_status' })
   async validateStatus(@Payload() data: any): Promise<boolean > {
    const stall_id = data;

    const stall = await this.stallsService.findOne(stall_id);
    if (!stall) {
        return false;
    }
    const isStallActive = stall.status === 'activo' || stall.status === 'aprobado';
    if (!isStallActive) {
      return false;
    }
    return true ;
  }

  @MessagePattern({ cmd: 'get_active_stalls' })
   async findActive() {
    return this.stallsService.findActive(); 
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
