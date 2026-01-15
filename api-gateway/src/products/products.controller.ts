import {
  Controller, Get, Post, Body, Param, Patch, Delete, 
  UseGuards, Inject, Query, ParseUUIDPipe, ParseFloatPipe, 
  DefaultValuePipe, HttpException, HttpStatus 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom, Observable, throwError } from 'rxjs';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StallOwnershipGuard } from './stall-ownership.guard';
import { Role } from 'src/common/enums/role.enum';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';



@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    @Inject('STALLS_SERVICE') private readonly stallsClient: ClientProxy,
  ) {}

  // RUTAS PÚBLICAS 

  @Get('public/catalog')
  async getPublicCatalog(
    @Query('stall_id') stall_id?: string,
    @Query('category') category?: string,
    @Query('minPrice', new DefaultValuePipe(0), ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', new DefaultValuePipe(10000), ParseFloatPipe) maxPrice?: number,
  ){
    try {
      const response = await firstValueFrom(
        this.stallsClient.send({ cmd: 'get_active_stalls' }, {})
      );

    //Extrae solo los IDs
    console.log('Respuesta cruda de Stalls:', response);
    const activeStalls = response.map((s: any) => s.id);

    if (activeStalls.length === 0) return [];
    const products = await firstValueFrom(this.productsClient.send({ cmd: 'get_filtered_products' }, 
        { stall_id, category, minPrice, maxPrice, activeStalls}
      )
    );

    return products;

  } catch (error) {
    throw new HttpException(
      'Error al obtener el catálogo de productos. Verifique la conexión con los servicios.',
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}

  //RUTAS PRIVADAS (EMPRENDEDOR) 

  @Post()
  @Roles(Role.EMPRENDEDOR)
  @UseGuards(JwtAuthGuard,RolesGuard,StallOwnershipGuard)
  create(@Body() createProductDto: any): Observable<any> {
     const data = {
      ...createProductDto,
      is_available: false
    };
    return this.productsClient
      .send({ cmd: 'create_product' }, data)
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
  @Roles(Role.EMPRENDEDOR)
  @UseGuards(JwtAuthGuard,RolesGuard)findAll() {
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
  @Roles(Role.EMPRENDEDOR)
  @UseGuards(JwtAuthGuard,RolesGuard)findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'get_product_by_id' }, id).pipe(
      catchError(() => {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }),
    );
  }

  @Patch(':id')
  @Roles(Role.EMPRENDEDOR)
  @UseGuards(JwtAuthGuard,RolesGuard,StallOwnershipGuard)
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
  @Roles(Role.EMPRENDEDOR)
@UseGuards(JwtAuthGuard,RolesGuard,StallOwnershipGuard)
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