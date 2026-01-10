import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: any): Promise<User> {
    const password = userData.password;
    if (!password) throw new Error('La contraseña es requerida');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = this.userRepository.create({
      email: userData.email,
      fullName: userData.fullName || userData.name,
      role: userData.role || 'cliente',
      passwordHash: hashedPassword,
    });
    
    return this.userRepository.save(newUser);
  }

  async update(id: string, updateData: any): Promise<User> {
    await this.userRepository.update(id, updateData);
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}