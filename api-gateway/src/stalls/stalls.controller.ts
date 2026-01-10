import { Controller, Post, Body, UseGuards, Request, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stalls')
export class StallsController {
  constructor(
    @Inject('STALLS_SERVICE') private readonly stallsClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  create(@Body() createStallDto: any, @Request() req: any) {
    const data = {
      ...createStallDto,
      ownerId: req.user.userId
    };
    return this.stallsClient.send({ cmd: 'create_stall' }, data);
  }

  @Get()
  findAll() {
    return this.stallsClient.send({ cmd: 'find_all_stalls' }, {});
  }
}