import {
  Controller, Get, Post, Body, Param, Patch, Delete, 
  UseGuards, Inject, Query, ParseUUIDPipe, ParseFloatPipe, 
  DefaultValuePipe, HttpException, HttpStatus 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { StallOwnershipGuard } from './stall-ownership.guard';


@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  // --- RUTAS PÚBLICAS ---

  @Get('public/catalog')
  getPublicCatalog(
    @Query('stall_id') stall_id?: string,
    @Query('minPrice', new DefaultValuePipe(0), ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', new DefaultValuePipe(10000), ParseFloatPipe) maxPrice?: number,
  ): Observable<any> {
    return this.productsClient
      .send({ cmd: 'get_filtered_products' }, { stall_id, minPrice, maxPrice })
      .pipe(
        catchError(() => 
          throwError(() => new HttpException(
            'No se pudo cargar el catálogo de productos. Servicio temporalmente fuera de línea.',
            HttpStatus.SERVICE_UNAVAILABLE
          ))
        )
      );
  }

  // --- RUTAS PRIVADAS (EMPRENDEDOR) ---

  @Post()
  @Roles('emprendedor')
  @UseGuards(StallOwnershipGuard)
  create(@Body() createProductDto: any): Observable<any> {
    return this.productsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError(() => 
          throwError(() => new HttpException(
            'Hubo un problema al registrar el producto. Por favor, revisa los datos e intenta de nuevo.',
            HttpStatus.BAD_REQUEST
          ))
        )
      );
  }

  @Get()
  @Roles('emprendedor')
  @UseGuards(StallOwnershipGuard)
  findAll() {
    return this.productsClient.send({ cmd: 'get_all_products' }, {}).pipe(
      catchError(() => {
        throw new HttpException(
          'Servicio de Productos no disponible',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }),
    );
  }

  @Get(':id')
  @Roles('emprendedor')
  @UseGuards(StallOwnershipGuard)
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'get_product_by_id' }, { id }).pipe(
      catchError(() => {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }),
    );
  }

  @Patch(':id')
  @Roles('emprendedor')
  @UseGuards(StallOwnershipGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: any
  ): Observable<any> {
    return this.productsClient
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError(() => 
          throwError(() => new HttpException(
            `No se pudo actualizar el producto con ID: ${id}.`,
            HttpStatus.INTERNAL_SERVER_ERROR
          ))
        )
      );
  }

  @Delete(':id')
  @Roles('emprendedor')
  @UseGuards(StallOwnershipGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Observable<any> {
    return this.productsClient
      .send({ cmd: 'delete_product' }, id)
      .pipe(
        catchError(() => 
          throwError(() => new HttpException(
            'Error al intentar eliminar el producto. Es posible que ya no esté disponible.',
            HttpStatus.INTERNAL_SERVER_ERROR
          ))
        )
      );
  }
}