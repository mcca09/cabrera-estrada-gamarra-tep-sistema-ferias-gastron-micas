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

  @MessagePattern({ cmd: 'update_order_status' })
  async updateStatus(@Payload() data: { id: string; status: string }) {
    console.log('🔄 Actualizando estado:', data);
    return await this.ordersService.updateStatus(data.id, data.status);
  }

  @MessagePattern({ cmd: 'get_stall_stats' })
  getStats(@Payload() data: { stallId: string }) {
    return this.ordersService.getStallStats(data.stallId);
  }
  
  // 1. Ver todas las órdenes (Admin)
  @MessagePattern({ cmd: 'get_all_orders_admin' })
  async findAllAdmin() {
    console.log('📊 Admin solicitando todas las órdenes');
    return await this.ordersService.findAll(); 
  }

  // 2. Producto más vendido
  @MessagePattern({ cmd: 'get_best_seller' })
  async getBestSeller() {
    return await this.ordersService.findBestSeller();
  }

  // 3. Volumen diario de ventas
  @MessagePattern({ cmd: 'get_daily_volume' })
  async getDailyVolume() {
    return await this.ordersService.findDailyVolume();
  }
}