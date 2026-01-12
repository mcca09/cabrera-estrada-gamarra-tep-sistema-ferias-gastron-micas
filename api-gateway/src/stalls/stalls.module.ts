import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StallsController } from './stalls.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STALLS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3004 },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
  ],
  controllers: [StallsController],
})
export class StallsModule {}