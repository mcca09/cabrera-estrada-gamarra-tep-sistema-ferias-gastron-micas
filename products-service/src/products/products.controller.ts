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

  @MessagePattern({ cmd: 'get_all_products' })
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'get_product_by_id' })
  findOne(@Payload() id: string) {
    return this.productsService.findOne(id);
  }
  @MessagePattern({ cmd: 'get_filtered_products' })
    findAllFiltered(@Payload() filters: any) {
    return this.productsService.findFiltered(filters);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() data: { id: string; [key: string]: any }) {
    const { id, ...updateDto } = data;
    return this.productsService.update(id, updateDto); 
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload() id: string) {
    return this.productsService.remove(id); 
  }

  @MessagePattern({ cmd: 'validate_and_update_stock' })
  validateStock(@Payload() data: { stall_id: string; items: any[] }) {
    return this.productsService.validateAndUpdateStock(data.stall_id, data.items);
  }

}
