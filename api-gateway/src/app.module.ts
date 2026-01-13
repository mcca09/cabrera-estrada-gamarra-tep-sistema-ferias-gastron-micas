import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { StallsModule } from './stalls/stalls.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    StallsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR, // Requisito 8: Registro de acciones
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}