import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stall } from './stalls.entity';
import { RpcException } from '@nestjs/microservices';
import { UpdateStallDto } from './update-stall.dto';
import { CreateStallDto } from './create-stall.dto';


@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stall)
    private readonly stallsRepository: Repository<Stall>,
  ) {}


  async create(data: CreateStallDto): Promise<Stall> {
    try {
      const newStall = this.stallsRepository.create(data);
      return await this.stallsRepository.save(newStall);
    } catch (error) {
      console.error('Error en Microservicio Stalls:', error.message);
      throw new RpcException({message: 'Error al insertar en la base de datos',status: 500});
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

  async update(id: string, ownerId: string, updateData: UpdateStallDto): Promise<Stall> {
    const stall = await this.findOne(id);
    
    if (stall.ownerId !== ownerId) {
      throw new RpcException({ message: 'No eres el dueño de este puesto', status: 401 });
    }

    if (updateData.name) stall.name = updateData.name;
    if (updateData.description) stall.description = updateData.description;

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

  async disapprove(id: string): Promise<Stall> {
    const stall = await this.findOne(id);
    stall.status = 'pendiente';
    return await this.stallsRepository.save(stall);
  }

  async activate(id: string, ownerId: string): Promise<Stall> {
    const stall = await this.findOne(id);
    if (stall.ownerId !== ownerId) {
      throw new RpcException({ message: 'Solo el dueño puede activar el puesto', status: 401 });
    }
    if (stall.status === 'pendiente') {
      throw new RpcException({ message: 'El puesto debe estar aprobado por un organizador', status: 400 });
    }
    stall.status = 'activo';
    return await this.stallsRepository.save(stall);
  }

  async inactivate(id: string, ownerId: string): Promise<Stall> {
    const stall = await this.findOne(id);
    if (stall.ownerId !== ownerId) {
      throw new RpcException({ message: 'Solo el dueño puede activar el puesto', status: 401 });
    }
    if (stall.status === 'pendiente') {
      throw new RpcException({ message: 'El puesto debe estar aprobado por un organizador', status: 400 });
    }
    stall.status = 'aprobado';
    return await this.stallsRepository.save(stall);
  }

  //Este es el del commit antes de las 12.
  /*async validateAccess(userId: string, stall_id: string): Promise<void> {
    const stall = await this.findOne(stall_id);
    if (stall.ownerId !== userId) {
      throw new RpcException({ message: 'No eres el dueño de este puesto', status: 401 });
    }
  }*/ 

  async validateAccess(userId: string, stall_id: string): Promise<boolean> {
    const stall = await this.findOne(stall_id);
    if (!stall || stall.ownerId !== userId) {
      return false;
    }
    return true;
  }
}