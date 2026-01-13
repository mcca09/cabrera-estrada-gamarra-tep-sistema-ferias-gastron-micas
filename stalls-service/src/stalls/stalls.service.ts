import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stall } from './stalls.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stall)
    private readonly stallsRepository: Repository<Stall>,
  ) {}

  async create(data: any) {
    try {
      const newStall = this.stallsRepository.create(data);
      return await this.stallsRepository.save(newStall);
    } catch (error) {
      console.error('Error en Microservicio Stalls:', error.message);
      throw new InternalServerErrorException('Error al insertar en la base de datos');
    }
  }

  async findAll() {
    return await this.stallsRepository.find();
  }

  async findOne(id: string) {
    const stall = await this.stallsRepository.findOne({ where: { id } });
    if (!stall) {
      throw new RpcException({ status: 404, message: 'Puesto no encontrado' });
    }
    return stall;
  }

  async findActive(){
    return await this.stallsRepository.find({ where: [{status: 'activo'}]});
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