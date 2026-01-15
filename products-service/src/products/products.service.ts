import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository, DataSource } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource, 
  ) {}

  async validateAndUpdateStock(stallId: string, items: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    // 👇 CORRECCIÓN 1: Definimos el tipo del array explícitamente como any[]
    const validatedItems: any[] = [];

    try {
      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { 
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' } 
        });

        if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
        
        if (product.stall_id !== stallId) throw new Error(`El producto ${product.name} no pertenece al puesto actual`);
        
        if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

        product.stock -= item.quantity;
        product.is_available = product.stock > 0;
        
        await queryRunner.manager.save(product);

        validatedItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price 
        });
      }

      await queryRunner.commitTransaction();
      return { success: true, validatedItems }; 

    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { success: false, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.stock <= 0) { createProductDto.is_available = false;}
    else{ createProductDto.is_available = true;}
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> { return await this.productRepository.find(); }
  
  async findOne(id: any): Promise<Product | null> { return await this.productRepository.findOne({ where: { id } }); }

  async findFiltered(filters: any): Promise<Product[]> {
    const { category, stall_id, minPrice, maxPrice, activeStalls} = filters;
    const where: any = { is_available: true }; 
    if (category) where.category = category;
    if (activeStalls && activeStalls.length > 0) {
      if (stall_id) {
        if (activeStalls.includes(stall_id)) where.stall_id = stall_id;
        else return [];
      } else where.stall_id = In(activeStalls);
    } else return [];
    
    if (minPrice && maxPrice) where.price = Between(minPrice, maxPrice);
    else if (minPrice) where.price = MoreThanOrEqual(minPrice);
    else if (maxPrice) where.price = LessThanOrEqual(maxPrice);
    return await this.productRepository.find({ where });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const product = await this.findOne(id);
    if (!product) return null;

    // 👇 CORRECCIÓN 2: Acceso seguro a propiedades usando casting (as any) 
    // Esto soluciona el error si UpdateProductDto no está detectando las propiedades heredadas
    const dto: any = updateProductDto;

    if (dto.stock !== undefined) {
      dto.is_available = dto.stock > 0;
    } else if (dto.is_available !== undefined) {
      // Si solo actualizan disponibilidad, validamos contra el stock actual de la DB
      dto.is_available = product.stock > 0;
    }

    const updatedProduct = this.productRepository.merge(product, dto);
    return await this.productRepository.save(updatedProduct);
  }

  async remove(id: string): Promise<boolean> {
    const product = await this.findOne(id);
    if (!product) return false;
    const result = await this.productRepository.delete(id);
    return result.affected !== undefined;
  }
}