import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StallsService } from './stalls.service';
import { StallsController } from './stalls.controller';
import { Stall } from './stalls.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stall])],
  controllers: [StallsController],
  providers: [StallsService],
})
export class StallsModule {}
