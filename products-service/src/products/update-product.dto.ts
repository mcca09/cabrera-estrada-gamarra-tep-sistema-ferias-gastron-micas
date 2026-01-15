import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Hace que todos los campos de creación sean opcionales para la edición
export class UpdateProductDto extends PartialType(CreateProductDto) {}