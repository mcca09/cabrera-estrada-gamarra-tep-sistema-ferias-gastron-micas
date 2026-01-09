import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stalls')
export class Stall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  ownerId: string; // ID del emprendedor
}
