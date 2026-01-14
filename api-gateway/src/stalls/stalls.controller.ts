import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  Delete,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { AllExceptionsFilter } from '../common/rpc-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('stalls')
@UseFilters(AllExceptionsFilter)
export class StallsController {
  constructor(
    @Inject('STALLS_SERVICE') private readonly stallsClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Post()
  create(@Body() createStallDto: any, @Req() req: any) {
    const payload = {
      ...createStallDto,
      ownerId: req.user.id,
    };
    return this.stallsClient.send({ cmd: 'create_stall' }, payload);
  }

  @Get()
  findAll() {
    return this.stallsClient.send({ cmd: 'find_all_stalls' }, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZADOR)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.stallsClient
      .send({ cmd: 'approve_stall' }, { id })
      .pipe(catchError((err) => throwError(() => err)));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Patch(':id/activate')
  activate(@Param('id') id: string, @Req() req: any) {
    return this.stallsClient
      .send({ cmd: 'activate_stall' }, { id, ownerId: req.user.id })
      .pipe(catchError((err) => throwError(() => err)));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Patch(':id/inactivate')
  inactivate(@Param('id') id: string, @Req() req: any) {
    return this.stallsClient
      .send({ cmd: 'inactivate_stall' }, { id, ownerId: req.user.id })
      .pipe(catchError((err) => throwError(() => err)));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Put(':id')
  update(@Param('id') id: string, @Body('updateData') updateData: any, @Req() req: any) {
    return this.stallsClient
      .send(
        { cmd: 'update_stall' },
        {
          id,
          ownerId: req.user.id,
          updateData,
        },
      )
      .pipe(catchError((err) => throwError(() => err)));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.stallsClient
      .send({ cmd: 'delete_stall' }, { id, ownerId: req.user.id })
      .pipe(catchError((err) => throwError(() => err)));
  }
}