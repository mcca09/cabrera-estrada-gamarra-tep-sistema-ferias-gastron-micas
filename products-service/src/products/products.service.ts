import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
}
