import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { catchError } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  @Get()
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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: any) {
    return this.productsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError(() => {
          throw new HttpException(
            'Error al crear producto',
            HttpStatus.BAD_REQUEST,
          );
        }),
      );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'get_product_by_id' }, { id }).pipe(
      catchError(() => {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }),
    );
  }
}
