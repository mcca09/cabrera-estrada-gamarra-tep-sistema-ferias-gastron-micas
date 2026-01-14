import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  async create(@Payload() data: any) {
    console.log('📨 Orden recibida:', data);
    return await this.ordersService.create(data);
  }

  @MessagePattern({ cmd: 'get_user_orders' })
  async getUserOrders(@Payload() data: any) {
    return await this.ordersService.findAllByUser(data.customer_id);
  }

  // 👇 ESTO ES LO QUE FALTABA 👇
  @MessagePattern({ cmd: 'update_order_status' })
  async updateStatus(@Payload() data: { id: string; status: string }) {
    console.log('🔄 Actualizando estado:', data);
    return await this.ordersService.updateStatus(data.id, data.status);
  }

  // Agregamos de una vez el de estadísticas para el futuro
  @MessagePattern({ cmd: 'get_stall_stats' })
  getStats(@Payload() data: { stallId: string }) {
    return this.ordersService.getStallStats(data.stallId);
  }

}