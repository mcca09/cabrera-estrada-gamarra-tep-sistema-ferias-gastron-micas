import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importante: ConfigService
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

@Module({
  imports: [
    // 1. Configuración de Variables de Entorno (Global)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Base de Datos (Modo Asíncrono - ¡La forma pro!)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        // Aquí arreglamos el problema del parseInt:
        port: configService.get<number>('DB_PORT') || 5432, 
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'tu_password',
        database: configService.get<string>('DB_NAME') || 'orders_db',
        
        // Carga las entidades que importamos arriba
        entities: [Order, OrderItem], 
        
        // Sincroniza las tablas (¡Solo usar en desarrollo!)
        synchronize: true, 
        autoLoadEntities: true,
      }),
    }),

    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}