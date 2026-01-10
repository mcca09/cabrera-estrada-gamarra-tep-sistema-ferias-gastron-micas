import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() createOrderDto: any, @Request() req) {
    const orderData = {
      ...createOrderDto,
      customer_id: req.user.id // Usamos .id porque JwtStrategy devuelve { id, email, role }
    };
    return this.ordersClient.send({ cmd: 'create_order' }, orderData);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Request() req) {
    const customer_id = req.user.id;
    return this.ordersClient.send({ cmd: 'get_user_orders' }, { customer_id });
  }
}
