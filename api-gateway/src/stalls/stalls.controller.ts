import { Controller, Post, Body, UseGuards, Request, Get, Inject, Patch,Delete,Param, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { catchError, throwError } from 'rxjs';
import { Role } from 'src/common/enums/role.enum';

@Controller('stalls')
export class StallsController {
  constructor(
    @Inject('STALLS_SERVICE') private readonly stallsClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  create(@Body() createStallDto: any, @Request() req: any) {
    const userId = req.user.id
    const data = {
      ...createStallDto,
      ownerId: userId,
      status: 'pendiente'
    };
    return this.stallsClient.send({ cmd: 'create_stall' }, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Get()
  findAll() {
    return this.stallsClient.send({ cmd: 'get_all_stalls' }, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stallsClient.send({ cmd: 'find_one_stall' }, id);
  }

  @Get('public')
  findAllActive() {
    return this.stallsClient.send({ cmd: 'get_active_stalls' }, {});
  }
  
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZADOR)
  approve(@Param('id') id: string) {
    return this.stallsClient.send({ cmd: 'approve_stall' }, { id })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Patch(':id/disapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZADOR)
  disapprove(@Param('id') id: string) {
    return this.stallsClient.send({ cmd: 'disapprove_stall' }, { id })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  activate(@Param('id') id: string, @Request() req: any) {
    const ownerId = req.user.id;
    return this.stallsClient.send({ cmd: 'activate_stall' }, { id, ownerId })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Patch(':id/inactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.EMPRENDEDOR)
  inactivate(@Param('id') id: string, @Request() req: any) {
    const ownerId = req.user.id;
    return this.stallsClient.send({ cmd: 'inactivate_stall' }, { id, ownerId })
      .pipe(catchError(err => throwError(() => err)));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  update(@Param('id') id: string, @Body() updateData: any, @Request() req: any) {
    const ownerId = req.user.id
    if (!ownerId) { throw new UnauthorizedException('Token inválido o usuario no encontrado'); }
    return this.stallsClient.send({ cmd: 'update_stall' }, { id, ownerId, updateData })
      .pipe(catchError(err => throwError(() => err)));
  }
 

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  remove(@Param('id') id: string, @Request() req: any) {
    console.log('PARAM ID:', id); console.log('REQ.USER:', req.user);
    if (!req.user?.id) { throw new UnauthorizedException('Token inválido o usuario no encontrado'); }
    const ownerId = req.user.id;
    return this.stallsClient.send({ cmd: 'delete_stall' }, { id, ownerId })
      .pipe(catchError(err => throwError(() => err)));
  }
}