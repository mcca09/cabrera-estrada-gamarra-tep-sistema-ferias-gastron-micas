import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

// Esto protege tu código de errores de dedo (Typos)
export enum OrderStatus {
  PENDING = 'pendiente',
  PREPARING = 'preparando',
  READY = 'listo',
  DELIVERED = 'entregado',
  CANCELLED = 'cancelado',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Mapeamos 'user_id' de la BD a 'userId' en el código
  @Column({ name: 'customer_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'stall_id', type: 'uuid' })
  stallId: string;

  // 'numeric' es mejor que 'decimal' en Postgres para dinero
  @Column('numeric', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus; // Ahora es tipo OrderStatus, no string suelto

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}