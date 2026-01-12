import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stall } from './stalls.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stall)
    private readonly stallRepository: Repository<Stall>,
  ) {}

  async create(data: any) {
    const newStall = this.stallRepository.create({
      ...data,
      status: 'pendiente'
    });
    return await this.stallRepository.save(newStall);
  }

  async findAll() {
    return await this.stallRepository.find();
  }

  async findOne(id: string) {
    const stall = await this.stallRepository.findOne({ where: { id } });
    if (!stall) {
      throw new RpcException({ status: 404, message: 'Puesto no encontrado' });
    }
    return stall;
  }

  async approve(id: string) {
    const stall = await this.findOne(id);
    stall.status = 'aprobado';
    return await this.stallRepository.save(stall);
  }

  async setStatus(id: string, ownerId: string, status: 'activo' | 'inactivo') {
    const stall = await this.findOne(id);

    if (stall.ownerId !== ownerId) {
      throw new RpcException({ status: 401, message: 'No autorizado: No eres el owner de este puesto' });
    }

    if (status === 'activo' && stall.status === 'pendiente') {
      throw new RpcException({ status: 400, message: 'El puesto debe ser aprobado antes de activarse' });
    }

    stall.status = status;
    return await this.stallRepository.save(stall);
  }

  async update(id: string, ownerId: string, updateData: any) {
    const stall = await this.findOne(id);

    if (stall.ownerId !== ownerId) {
      throw new RpcException({ status: 401, message: 'No autorizado: No eres el owner de este puesto' });
    }

    Object.assign(stall, updateData);
    return await this.stallRepository.save(stall);
  }
}