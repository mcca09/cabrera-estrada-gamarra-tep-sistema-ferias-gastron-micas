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

  @MessagePattern({ cmd: 'get_all_stalls' }) // Corregido cmd
  async findAll() {
    return this.stallsService.findAll();
  }

  @MessagePattern({ cmd: 'get_stall_by_id' }) 
  async findOne(@Payload() data: any) {
    const id = data.id || data;
    return this.stallsService.findOne(id); 
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

    /*const isStallActive = stall.status === 'activo' || stall.status === 'aprobado';
    if (!isStallActive) {
      return { valid: false, message: 'El puesto debe estar activo o aprobado para gestionar productos.' };
    }*/
    return { valid: true };
  }

  @MessagePattern({ cmd: 'get_active_stalls' })
   async findActive() {
    return this.stallsService.findActive(); 
  }
}  
