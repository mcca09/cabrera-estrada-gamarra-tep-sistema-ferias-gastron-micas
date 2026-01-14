import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity'; // Asegúrate de importar esto

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  // 1. CREAR ORDEN CON VALIDACIÓN
  async create(data: any) {
    const { items, customer_id, stall_id } = data;

    // A) Validar Stock y Obtener Precios Reales del Microservicio de Productos
    let validationResponse;
    try {
      validationResponse = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_and_update_stock' }, { stall_id, items })
      );
    } catch (error) {
       throw new RpcException(error.message || 'Error de comunicación con productos');
    }

    if (!validationResponse.success) {
      throw new RpcException(validationResponse.message || 'Stock insuficiente o error de validación');
    }

    // Los productos validados vienen con su precio real
    const validatedItems = validationResponse.validatedItems; 

    // B) Calcular Total
    const totalAmount = validatedItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

    // C) Guardar Orden
    const newOrder = this.orderRepository.create({
      userId: customer_id,
      stallId: stall_id,
      total: totalAmount,
      status: OrderStatus.PENDING,
      items: validatedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price, // Precio seguro de la DB
      })),
    });

    return await this.orderRepository.save(newOrder);
  }

  // ... (Tus métodos findAllByUser, updateStatus, getStallStats, findAll, findBestSeller, findDailyVolume se quedan IGUAL que tu original) ...
  async findAllByUser(customer_id: string) {
    return await this.orderRepository.find({ where: { userId: customer_id }, relations: ['items'] });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Orden ${id} no encontrada`);
    order.status = status as OrderStatus; 
    return await this.orderRepository.save(order);
  }

  async getStallStats(stallId: string) {
     const { total } = await this.orderRepository.createQueryBuilder('order')
       .select('SUM(order.total)', 'total').where('order.stallId = :stallId', { stallId }).getRawOne();
     return { stallId, total_sales: parseFloat(total) || 0 };
  }

  async findAll() {
     return await this.orderRepository.find({ relations: ['items'], order: { createdAt: 'DESC' } });
  }

  async findBestSeller() {
     return await this.orderRepository.createQueryBuilder('order').leftJoin('order.items', 'item')
       .select('item.productId', 'productId').addSelect('SUM(item.quantity)', 'totalSold')
       .groupBy('item.productId').orderBy('SUM(item.quantity)', 'DESC').limit(1).getRawOne();
  }

  async findDailyVolume() {
     return await this.orderRepository.createQueryBuilder('order').select("DATE(order.createdAt)", 'date') 
       .addSelect("SUM(order.total)", 'totalSales').groupBy('date').orderBy('date', 'DESC').getRawMany();
  }

  // 8. NUEVO: ANALYTICS / DASHBOARD
  async getAnalytics(filters: any) {
    const { stallId, dateFrom, dateTo, status } = filters;
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (stallId) query.andWhere('order.stallId = :stallId', { stallId });
    if (status) query.andWhere('order.status = :status', { status });
    if (dateFrom) query.andWhere('order.createdAt >= :dateFrom', { dateFrom: new Date(dateFrom) });
    if (dateTo) {
      const end = new Date(dateTo); end.setHours(23, 59, 59);
      query.andWhere('order.createdAt <= :dateTo', { dateTo: end });
    }

    const orders = await query.getMany();
    const totalSales = orders.reduce((acc, o) => acc + Number(o.total), 0);
    
    // Agrupación simple por puesto
    const salesByStall = orders.reduce((acc, o) => {
      acc[o.stallId] = (acc[o.stallId] || 0) + Number(o.total);
      return acc;
    }, {});

    return { metrics: { totalSales, count: orders.length }, salesByStall, orders };
  }
}