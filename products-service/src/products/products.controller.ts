import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './create-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find_all_products' })
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload() id: string) {
    return this.productsService.findOne(id);
  }
}
