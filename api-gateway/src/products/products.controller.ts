import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Inject,
  HttpException,
  HttpStatus,
  Req,
  Query,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    @Inject('STALLS_SERVICE') private readonly stallsClient: ClientProxy,
  ) {}

  @Get('public/catalog')
  async getPublicCatalog(
    @Query('category') category?: string,
    @Query('stall_id') stall_id?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return await firstValueFrom(
      this.productsClient.send(
        { cmd: 'get_filtered_products' },
        { category, stall_id, minPrice, maxPrice },
      ),
    );
  }

  @Get('public/stalls')
  async getPublicStalls() {
    return await firstValueFrom(
      this.stallsClient.send({ cmd: 'get_active_stalls' }, {}),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: any, @Req() req: any) {
    const userId = req.user.id;

    const isOwner = await firstValueFrom(
      this.stallsClient.send(
        { cmd: 'verify_stall_ownership' },
        { userId, stall_id: createProductDto.stall_id },
      ),
    );

    if (!isOwner) {
      throw new ForbiddenException('No tienes permiso sobre este puesto.');
    }

    return await firstValueFrom(
      this.productsClient.send({ cmd: 'create_product' }, createProductDto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any, @Req() req: any) {
    const userId = req.user.id;

    const product = await firstValueFrom(
      this.productsClient.send({ cmd: 'get_product_by_id' }, id),
    );
    if (!product) throw new NotFoundException('Producto no encontrado');

    const isOwner = await firstValueFrom(
      this.stallsClient.send(
        { cmd: 'verify_stall_ownership' },
        { userId, stall_id: product.stall_id },
      ),
    );

    if (!isOwner) {
      throw new ForbiddenException('No tienes permiso para editar este producto.');
    }

    return await firstValueFrom(
      this.productsClient.send({ cmd: 'update_product' }, { id, ...updateProductDto }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;

    const product = await firstValueFrom(
      this.productsClient.send({ cmd: 'get_product_by_id' }, id),
    );
    if (!product) throw new NotFoundException('Producto no encontrado');

    const isOwner = await firstValueFrom(
      this.stallsClient.send(
        { cmd: 'verify_stall_ownership' },
        { userId, stall_id: product.stall_id },
      ),
    );

    if (!isOwner) {
      throw new ForbiddenException('No tienes permiso para eliminar este producto.');
    }

    return await firstValueFrom(
      this.productsClient.send({ cmd: 'delete_product' }, id),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await firstValueFrom(
      this.productsClient.send({ cmd: 'get_product_by_id' }, id),
    );
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
}