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

  // 👇👇👇 AQUÍ ESTÁ LO NUEVO QUE FALTABA 👇👇👇
  @Get('stats/stall/:id')
  @ApiOperation({ summary: 'Obtener el total de ventas de un puesto específico' })
  getStallStats(@Param('id') id: string) {
    // Le pasamos la petición al microservicio
    return this.ordersClient.send({ cmd: 'get_stall_stats' }, { stallId: id });
  }
}