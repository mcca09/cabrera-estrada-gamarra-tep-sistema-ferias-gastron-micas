import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, UseFilters } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { AllExceptionsFilter } from '../common/rpc-exception.filter';

@Controller('stalls')
@UseFilters(AllExceptionsFilter)
export class StallsController {
  constructor(
    @Inject('STALLS_SERVICE') private readonly stallsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createStallDto: any) {
    return this.stallsClient.send({ cmd: 'create_stall' }, createStallDto);
  }

  @Get()
  findAll() {
    return this.stallsClient.send({ cmd: 'find_all_stalls' }, {});
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.stallsClient.send({ cmd: 'approve_stall' }, { id })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string, @Body('ownerId') ownerId: string) {
    return this.stallsClient.send({ cmd: 'activate_stall' }, { id, ownerId })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Patch(':id/inactivate')
  inactivate(@Param('id') id: string, @Body('ownerId') ownerId: string) {
    return this.stallsClient.send({ cmd: 'inactivate_stall' }, { id, ownerId })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const { ownerId, updateData } = body;
    return this.stallsClient.send({ cmd: 'update_stall' }, { id, ownerId, updateData })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body('ownerId') ownerId: string) {
    return this.stallsClient.send({ cmd: 'delete_stall' }, { id, ownerId })
      .pipe(catchError(err => throwError(() => err)));
  }
}