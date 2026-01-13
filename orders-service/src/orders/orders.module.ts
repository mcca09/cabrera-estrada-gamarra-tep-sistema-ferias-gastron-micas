import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices'; // 👈 Importante
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    // 👇 Registramos el cliente para hablar con PRODUCTOS
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE', // Nombre para inyectar en el servicio
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3003,        // Puerto definido para el ms de productos
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}