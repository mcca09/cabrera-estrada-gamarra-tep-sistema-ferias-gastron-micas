import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StallsController } from './stalls.controller';
import { StallsService } from './stalls.service';
import { Stall } from './stalls.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stall]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1', 
          port: 3001,        
        },
      },
    ]),
  ],
  controllers: [StallsController],
  providers: [StallsService],
})
export class StallsModule {}