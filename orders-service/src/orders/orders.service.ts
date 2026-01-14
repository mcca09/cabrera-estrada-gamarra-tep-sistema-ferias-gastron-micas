import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // 1. CREAR ORDEN (Tu lógica original)
  async create(data: any) {
    const { items, customer_id } = data;

    // Calcular el total
    const totalAmount = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.price) * Number(item.quantity));
    }, 0);

    // Crear la entidad
    const newOrder = this.orderRepository.create({
      userId: customer_id,
      stallId: items[0]?.stallId, 
      total: totalAmount,
      status: OrderStatus.PENDING,
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return await this.orderRepository.save(newOrder);
  }

  // 2. BUSCAR POR USUARIO
  async findAllByUser(customer_id: string) {
    return await this.orderRepository.find({
      where: { userId: customer_id },
      relations: ['items'],
    });
  }

  // 3. ACTUALIZAR ESTADO (PATCH)
  async updateStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Orden ${id} no encontrada`);
    }

    order.status = status as OrderStatus; 
    return await this.orderRepository.save(order);
  }

  // 4. ESTADÍSTICAS POR PUESTO (ORGANIZADOR)
  async getStallStats(stallId: string) {
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

  // ==========================================================
  // 👇 AQUÍ EMPIEZAN LOS MÉTODOS DEL ADMIN (CORREGIDOS) 👇
  // ==========================================================

  // 5. OBTENER TODAS LAS ÓRDENES (ADMIN)
  async findAll() {
    return await this.orderRepository.find({
      relations: ['items'], 
      // CORREGIDO AQUÍ: Usamos 'createdAt' en lugar de 'created_at'
      order: { createdAt: 'DESC' }, 
    });
  }
  
 // 6. PRODUCTO MÁS VENDIDO (ADMIN) 
  async findBestSeller() {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .select('item.productId', 'productId')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .groupBy('item.productId')
      // 👇 AQUÍ ESTÁ EL CAMBIO 👇
      // En vez de ordenar por 'totalSold', ordenamos por la fórmula matemática.
      // Así Postgres no se confunde buscando columnas que no existen.
      .orderBy('SUM(item.quantity)', 'DESC') 
      .limit(1)
      .getRawOne();
  }

  // 7. VOLUMEN DIARIO DE VENTAS (ADMIN)
  async findDailyVolume() {
    return await this.orderRepository
      .createQueryBuilder('order')
      // CORREGIDO AQUÍ TAMBIÉN: 'createdAt'
      .select("DATE(order.createdAt)", 'date') 
      .addSelect("SUM(order.total)", 'totalSales')
      .groupBy('date')
      .orderBy('date', 'DESC')
      .getRawMany();
  }
}