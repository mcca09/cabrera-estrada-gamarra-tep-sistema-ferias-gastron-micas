import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Importamos Order y OrderStatus como lo tenías
import { Order, OrderStatus } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>, // Respetamos tu nombre 'orderRepository'
  ) {}

  // --- TU LÓGICA ORIGINAL (MANTENIDA) ---
  async create(data: any) {
    const { items, customer_id } = data;

    // Tu lógica de cálculo
    const totalAmount = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.price) * Number(item.quantity));
    }, 0);

    // Creamos la orden
    const newOrder = this.orderRepository.create({
      userId: customer_id,
      stallId: items[0]?.stallId, 
      total: totalAmount,
      status: OrderStatus.PENDING, // Usamos el Enum
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return await this.orderRepository.save(newOrder);
  }

  async findAllByUser(customer_id: string) {
    return await this.orderRepository.find({
      where: { userId: customer_id }, // Respetamos tu campo 'userId'
      relations: ['items'],
    });
  }

  // --- 👇 LO NUEVO QUE FALTABA PARA QUITAR LOS ERRORES 👇 ---

  // 1. Método para actualizar estado (PATCH)
  async updateStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Orden ${id} no encontrada`);
    }

    // Actualizamos el estado. "as OrderStatus" fuerza a que TypeScript lo acepte
    order.status = status as OrderStatus; 
    return await this.orderRepository.save(order);
  }

  // 2. Método para estadísticas del organizador
  async getStallStats(stallId: string) {
    // Sumamos el campo 'total' de todas las órdenes de este puesto
    const { total } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.stallId = :stallId', { stallId })
      .getRawOne();

    return {
      stallId,
      total_sales: parseFloat(total) || 0,
    };
  }
}