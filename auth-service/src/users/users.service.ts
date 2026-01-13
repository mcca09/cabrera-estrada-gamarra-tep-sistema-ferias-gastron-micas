import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async create(data: any): Promise<User> {
    const { password, ...userData } = data;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const userInstance = this.usersRepository.create({ 
      ...userData, 
      passwordHash 
    });

    const savedUser = await this.usersRepository.save(userInstance);
    return savedUser as unknown as User;
  }

  async update(id: string, data: any): Promise<User> {
    await this.usersRepository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Usuario no encontrado tras actualizar');
    return updated;
  }
}