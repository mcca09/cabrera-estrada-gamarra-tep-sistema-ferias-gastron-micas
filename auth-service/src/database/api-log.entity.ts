import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('api_logs')
export class ApiLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 255 })
  route: string;

  @Column({ length: 20 })
  method: string;

 // ACTUALIZACIÓN: Se añadió '| null' y '?' para permitir valores nulos en el tipado de TS
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | null;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'status_code' })
  statusCode: number;

  @Column({ type: 'text', nullable: true })
  message: string;
}
