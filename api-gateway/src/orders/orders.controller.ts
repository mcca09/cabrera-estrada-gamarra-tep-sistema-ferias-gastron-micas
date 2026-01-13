import { Controller, Post, Body, Inject, Get, Param, Patch, Query } from '@nestjs/common';
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

  // 1. Crear Orden
  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden de compra' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    console.log('🚀 Gateway validó y recibió:', createOrderDto);
    return this.ordersClient.send({ cmd: 'create_order' }, createOrderDto);
  }

  // 2. Historial de Usuario
  @Get('user/:id')
  @ApiOperation({ summary: 'Obtener todas las órdenes de un usuario' })
  getUserOrders(@Param('id') id: string) {
    return this.ordersClient.send({ cmd: 'get_user_orders' }, { customer_id: id });
  }

  // 3. Actualizar Estado
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

  // 4. Estadísticas del Puesto
  @Get('stall/:id/stats')
  @ApiOperation({ summary: 'Obtener el total de ventas de un puesto específico' })
  getStallStats(@Param('id') id: string) {
    return this.ordersClient.send({ cmd: 'get_stall_stats' }, { stallId: id });
  }

  // 5. Vista Global (Filtros: Fecha, Puesto, Estado)
  @Get('admin/all')
  @ApiOperation({ summary: 'Vista global de pedidos (Filtros: ?date=YYYY-MM-DD&stallId=X&status=Y)' })
  getAllOrders(@Query() query: any) {
    // query captura automáticamente los parámetros de la URL
    return this.ordersClient.send({ cmd: 'get_all_orders_admin' }, query);
  }

  // 6. Producto Más Vendido
  @Get('admin/best-seller')
  @ApiOperation({ summary: 'Obtener el producto más vendido de la feria' })
  getBestSeller() {
    return this.ordersClient.send({ cmd: 'get_best_seller' }, {});
  }

  // 7. Volumen Diario
  @Get('admin/daily-volume')
  @ApiOperation({ summary: 'Ver reporte de ventas totales agrupadas por día' })
  getDailyVolume() {
    return this.ordersClient.send({ cmd: 'get_daily_volume' }, {});
  }
}