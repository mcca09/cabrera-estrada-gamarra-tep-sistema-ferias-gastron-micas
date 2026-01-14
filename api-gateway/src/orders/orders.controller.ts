import { Controller, Post, Body, Inject, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from 'src/common/enums/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}
  
  @Post()
  @Roles(Role.CLIENTE)
  @UseGuards(JwtAuthGuard) 
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
  const userId = req.user.id;

  const orderData = {
    ...createOrderDto,
    customer_id: userId, 
  };
  return this.ordersClient.send({ cmd: 'create_order' }, orderData);
}


  @Get('user/:id')
  getUserOrders(@Param('id') id: string) {
    return this.ordersClient.send({ cmd: 'get_user_orders' }, { customer_id: id });
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersClient.send(
      { cmd: 'update_order_status' }, 
      { id, status: updateOrderStatusDto.status }
    );
  }

  @Get('stats/stall/:id')
  getStallStats(@Param('id') id: string) {
    return this.ordersClient.send({ cmd: 'get_stall_stats' }, { stallId: id });
  }
}