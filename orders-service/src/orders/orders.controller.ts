import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  async create(@Payload() data: any) {
    this.logger.log(`📨 Procesando orden para Stall: ${data.stall_id}`);
    return await this.ordersService.create(data);
  }

  @MessagePattern({ cmd: 'get_analytics' })
  async getAnalytics(@Payload() filters: any) {
    return await this.ordersService.getAnalytics(filters);
  }

  // Resto de métodos (sin cambios lógicos, solo copiados de tu original)
  @MessagePattern({ cmd: 'get_user_orders' })
  async getUserOrders(@Payload() data: any) { return await this.ordersService.findAllByUser(data.customer_id); }

  @MessagePattern({ cmd: 'update_order_status' })
  async updateStatus(@Payload() data: { id: string; status: string }) { return await this.ordersService.updateStatus(data.id, data.status); }

  @MessagePattern({ cmd: 'get_stall_stats' })
  getStats(@Payload() data: { stallId: string }) { return this.ordersService.getStallStats(data.stallId); }
  
  @MessagePattern({ cmd: 'get_all_orders_admin' })
  async findAllAdmin() { return await this.ordersService.findAll(); }

  @MessagePattern({ cmd: 'get_best_seller' })
  async getBestSeller() { return await this.ordersService.findBestSeller(); }

  @MessagePattern({ cmd: 'get_daily_volume' })
  async getDailyVolume() { return await this.ordersService.findDailyVolume(); }
}