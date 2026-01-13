/*
import { Controller, Post, Body, Get, Inject, Param, Patch, Put, UseFilters } from '@nestjs/common';
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

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const { ownerId, updateData } = body;
    return this.stallsClient.send({ cmd: 'update_stall' }, { id, ownerId, updateData })
      .pipe(catchError(err => throwError(() => err)));
  }
}
*/

import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  Patch,
  Put,
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

  // ACTUALIZACIÓN: Ruta protegida. Solo emprendedores pueden crear puestos.
  // Se extrae el 'id' del emprendedor automáticamente del token (req.user.id).
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Post()
  create(@Body() createStallDto: any, @Req() req: any) {
    const payload = {
      ...createStallDto,
      user: { 
        id: req.user.id, 
        role: req.user.role 
      },
    };
    return this.stallsClient.send({ cmd: 'create_stall' }, payload);
  }

  // ACTUALIZACIÓN: Ruta pública o para clientes. Permite ver el catálogo de puestos.
  @Get()
  findAll() {
    return this.stallsClient.send({ cmd: 'find_all_stalls' }, {});
  }

  // ACTUALIZACIÓN: Solo el ORGANIZADOR puede aprobar un puesto (Regla de negocio).
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZADOR)
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Req() req: any) {
    return this.stallsClient
      .send({ cmd: 'approve_stall' }, { id, adminId: req.user.id }) 
      .pipe(catchError((err) => throwError(() => err)));
  }

  // ACTUALIZACIÓN: Solo el EMPRENDEDOR puede activar su puesto.
  // Se envía el ownerId desde el token para validar propiedad en el microservicio.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Patch(':id/activate')
  activate(@Param('id') id: string, @Req() req: any) {
    return this.stallsClient
      .send(
        { cmd: 'activate_stall' },
        {
          id,
          ownerId: req.user.id,
        },
      )
      .pipe(catchError((err) => throwError(() => err)));
  }

  // ACTUALIZACIÓN: Solo el EMPRENDEDOR puede inactivar su puesto.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Patch(':id/inactivate')
  inactivate(@Param('id') id: string, @Req() req: any) {
    return this.stallsClient
      .send(
        { cmd: 'inactivate_stall' },
        {
          id,
          ownerId: req.user.id,
        },
      )
      .pipe(catchError((err) => throwError(() => err)));
  }

  // ACTUALIZACIÓN: Solo el EMPRENDEDOR puede editar sus datos.
  // No permitimos que envíen el ownerId por el body, lo tomamos del token por seguridad.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPRENDEDOR)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Req() req: any) {
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
}
