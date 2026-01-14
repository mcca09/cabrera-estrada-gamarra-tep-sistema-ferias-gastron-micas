import { Controller, Post, Body, Inject, Get, Param, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden de compra' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    console.log('🚀 Gateway validó y recibió:', createOrderDto);
    return this.ordersClient.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Obtener todas las órdenes de un usuario' })
  getUserOrders(@Param('id') id: string) {
    return this.ordersClient.send({ cmd: 'get_user_orders' }, { customer_id: id });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una orden' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    console.log(`🔄 Gateway solicitando cambio de estado para orden ${id}:`, updateOrderStatusDto);
    return this.ordersClient.send(
      { cmd: 'update_order_status' }, 
      { id, status: updateOrderStatusDto.status }
    );
  }

  @Get('stall/:id/stats') // Esto crea la ruta /api/orders/stall/123/stats
getStallStats(@Param('id') id: string) {
  return this.ordersClient.send({ cmd: 'get_stall_stats' }, { stallId: id });
}

  // 👇👇👇 LO NUEVO DEL ADMIN (Feature 5) 👇👇👇

  @Get('admin/all')
  @ApiOperation({ summary: 'Obtener todas las órdenes (Admin)' })
  findAllAdmin() {
    return this.ordersClient.send({ cmd: 'get_all_orders_admin' }, {});
  }

  @Get('admin/best-seller')
  @ApiOperation({ summary: 'Obtener el producto más vendido (Admin)' })
  findBestSeller() {
    return this.ordersClient.send({ cmd: 'get_best_seller' }, {});
  }

  @Get('admin/daily-volume')
  @ApiOperation({ summary: 'Obtener volumen de ventas diario (Admin)' })
  findDailyVolume() {
    return this.ordersClient.send({ cmd: 'get_daily_volume' }, {});
  }
}