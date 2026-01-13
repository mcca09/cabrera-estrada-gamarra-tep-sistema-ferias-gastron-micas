import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  
  constructor(private readonly ordersService: OrdersService) {}

  // 1. Creación de pedidos por parte del cliente
  @MessagePattern({ cmd: 'create_order' })
  async create(@Payload() data: any) {
    // data incluye: { customer_id, items: [...], stallId }
    return await this.ordersService.create(data);
  }

  // 2. Historial del cliente
  @MessagePattern({ cmd: 'get_user_orders' })
  async getUserOrders(@Payload() data: { customer_id: string }) {
    return await this.ordersService.findAllByUser(data.customer_id);
  }

  // 3. Actualizar Estados (pendiente -> preparando -> listo -> entregado)
  @MessagePattern({ cmd: 'update_order_status' })
  async updateStatus(@Payload() data: { id: string; status: string }) {
    return await this.ordersService.updateStatus(data.id, data.status);
  }

  // 4. Estadísticas y registro de ventas (Por puesto)
  @MessagePattern({ cmd: 'get_stall_stats' })
  getStats(@Payload() data: { stallId: string }) {
    return this.ordersService.getStallStats(data.stallId);
  }
  
  // 5. Vista Global (Con filtros: fecha, puesto, estado)
  @MessagePattern({ cmd: 'get_all_orders_admin' })
  async getAllOrdersAdmin(@Payload() filters: any) {
    return await this.ordersService.findAllOrdersAdmin(filters);
  }

  // 6. Producto Más Vendido (Top 1)
  @MessagePattern({ cmd: 'get_best_seller' })
  async getBestSeller() {
    return await this.ordersService.getBestSellingProduct();
  }

  // 7. Volumen Diario de Ventas
  @MessagePattern({ cmd: 'get_daily_volume' })
  async getDailyVolume() {
    return await this.ordersService.getDailySalesVolume();
  }
}