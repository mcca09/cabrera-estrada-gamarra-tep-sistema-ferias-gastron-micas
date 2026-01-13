import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stall } from './stalls.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stall)
    private stallsRepository: Repository<Stall>,
  ) {}

  async create(data: any, ownerId: string): Promise<Stall> {
    const stall = this.stallsRepository.create({
      name: data.name,
      description: data.description,
      ownerId: ownerId,
      status: 'pendiente',
    });
    return await this.stallsRepository.save(stall);
  }

  async findAll(): Promise<Stall[]> {
    return await this.stallsRepository.find();
  }

  async findOne(id: string): Promise<Stall> {
    const stall = await this.stallsRepository.findOne({ where: { id } });
    if (!stall) {
      throw new RpcException({ message: 'Puesto no encontrado', status: 404 });
    }
    return stall;
  }

  async update(id: string, updateData: any, ownerId: string): Promise<Stall> {
    const stall = await this.findOne(id);
    if (stall.ownerId !== ownerId) {
      throw new RpcException({ message: 'No eres el dueño de este puesto', status: 401 });
    }
    Object.assign(stall, updateData);
    return await this.stallsRepository.save(stall);
  }

  async remove(id: string, ownerId: string): Promise<{ message: string }> {
    const stall = await this.findOne(id);
    if (stall.ownerId !== ownerId) {
      throw new RpcException({ message: 'No tienes permiso para eliminar este puesto', status: 401 });
    }
    await this.stallsRepository.remove(stall);
    return { message: 'Puesto eliminado con éxito' };
  }

  async approve(id: string): Promise<Stall> {
    const stall = await this.findOne(id);
    stall.status = 'aprobado';
    return await this.stallsRepository.save(stall);
  }

  async activate(id: string, ownerId: string): Promise<Stall> {
    const stall = await this.findOne(id);
    if (stall.ownerId !== ownerId) {
      throw new RpcException({ message: 'Solo el dueño puede activar el puesto', status: 401 });
    }
    if (stall.status !== 'aprobado') {
      throw new RpcException({ message: 'El puesto debe estar aprobado por un organizador', status: 400 });
    }
    stall.status = 'activo';
    return await this.stallsRepository.save(stall);
  }
}