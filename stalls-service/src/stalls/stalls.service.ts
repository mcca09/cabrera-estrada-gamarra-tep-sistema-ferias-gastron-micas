import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stall } from './stalls.entity';

@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stall)
    private readonly stallRepository: Repository<Stall>,
  ) {}

  async create(data: any) {
    try {
      const newStall = this.stallRepository.create(data);
      return await this.stallRepository.save(newStall);
    } catch (error) {
      console.error('Error en Microservicio Stalls:', error.message);
      throw new InternalServerErrorException('Error al insertar en la base de datos');
    }
  }

  async findAll() {
    return await this.stallRepository.find();
  }

  async findOne(id: string) {
    return await this.stallRepository.findOne({ where: { id } });
  }
}