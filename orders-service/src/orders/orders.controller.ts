import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() data: any) {
    return this.ordersService.create(data);
  }

  @MessagePattern({ cmd: 'get_user_orders' })
  findAllByUser(@Payload() data: any) {
    // Accedemos a customer_id que viene en el payload
    const customer_id = data.customer_id;
    return this.ordersService.findAllByUser(customer_id); 
  }
}
