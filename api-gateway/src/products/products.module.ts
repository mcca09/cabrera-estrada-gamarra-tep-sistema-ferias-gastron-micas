import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'; 
import { PassportModule } from '@nestjs/passport'; 

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 

    ClientsModule.registerAsync([
      {
        name: 'PRODUCTS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PRODS_HOST') || 'localhost',
            port: 3003,
          },
        }),
      },
      {
        name: 'STALLS_SERVICE', 
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PRODS_HOST') || 'localhost',
            port: 3004, 
          },
        }),
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [JwtStrategy], 
})
export class ProductsModule {}