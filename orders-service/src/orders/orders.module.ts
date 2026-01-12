import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Module({
  imports: [
    // 1. IMPORTANTE: Registramos las Entidades aquí para que el Servicio
    // pueda usar @InjectRepository(Order) sin romperse.
    TypeOrmModule.forFeature([Order, OrderItem]), 
  ],
  controllers: [OrdersController],
  providers: [
    // 2. IMPORTANTE: Aquí registramos el servicio. 
    OrdersService, 
  ],
})
export class OrdersModule {}