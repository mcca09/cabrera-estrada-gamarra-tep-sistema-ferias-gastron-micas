import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.stock <= 0) { createProductDto.is_available = false;}
    else{ createProductDto.is_available = true;}
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: any): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async findFiltered(filters: any): Promise<Product[]> {
  const { category, stall_id, minPrice, maxPrice, activeStalls} = filters;
  const where: any = { is_available: true }; 

  if (category) where.category = category;
  if (activeStalls && activeStalls.length > 0) {
    if (stall_id) {
      if (activeStalls.includes(stall_id)) {
        where.stall_id = stall_id;
      } else {return [];}
    } else {
      where.stall_id = In(activeStalls);
    }
  } else {
    return [];
  }

  
  if (minPrice && maxPrice) where.price = Between(minPrice, maxPrice);
  else if (minPrice) where.price = MoreThanOrEqual(minPrice);
  else if (maxPrice) where.price = LessThanOrEqual(maxPrice);

  return await this.productRepository.find({ where });
}

async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
  const product = await this.findOne(id);
  if (!product) return null;

  if (updateProductDto.stock !== undefined) {
    updateProductDto.is_available = updateProductDto.stock > 0;
  } else if (updateProductDto.is_available !== undefined) {
    updateProductDto.is_available =  product.stock > 0 ;
  }

  const updatedProduct = this.productRepository.merge(product, updateProductDto);
  return await this.productRepository.save(updatedProduct);
}

async remove(id: string): Promise<boolean> {
  const product = await this.findOne(id);
  if (!product) return false;
  const result = await this.productRepository.delete(id);
  if (result.affected === undefined) return false;
  return true;
}

  async validateAndUpdateStock(stallId: string, items: any[]) {
    console.log('--- INICIANDO TRANSACCIÓN DE STOCK ---');
    console.log('Stall ID recibido:', stallId);
    console.log('Items recibidos:', items);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of items) {
        const productId = item.productId || item.product_id; 

        const product = await queryRunner.manager.findOne(Product, { 
            where: { id: productId } 
        });

        if (!product) {
          throw new Error(`Producto ID ${productId} no encontrado en BD`);
        }

        if (product.stall_id !== stallId) {
          throw new Error(`El producto ${product.name} es del puesto ${product.stall_id}, pero la orden es para ${stallId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}. Pedido: ${item.quantity}, Disponible: ${product.stock}`);
        }

        product.stock -= item.quantity;
        if (product.stock === 0) product.is_available = false;
        
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();
      console.log('--- TRANSACCIÓN EXITOSA ---');
      return { success: true };

    } catch (error) {
      console.error('--- ERROR EN TRANSACCIÓN ---', error.message);
      await queryRunner.rollbackTransaction();
      return { success: false, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }
}
