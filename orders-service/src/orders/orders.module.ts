import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
// 👇 1. Importamos ClientsModule y Transport
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    
    // 👇 2. Registramos el cliente para hablar con PRODUCTOS (Puerto 3003)
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE', 
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1', 
          port: 3003, // <--- IMPORTANTE: Puerto 3003 (Productos)
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService, 
  ],
})
export class OrdersModule {}