import { Injectable, NotFoundException, Inject, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { Order, OrderStatus } from './order.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    
    // 👇 Inyectamos el cliente (aunque no lo usemos ahora, lo dejamos listo)
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  // 1. CREACIÓN Y GESTIÓN DE PEDIDOS
  async create(data: any) {
    const { items, customer_id } = data;

    // --- PASO 1: Verificación de disponibilidad y stock ---
    if (items && items.length > 0) {
      for (const item of items) {
        
        // 👇👇 [MODO PRUEBA] SECCIÓN COMENTADA PARA EVITAR ERROR SI NO HAY PRODUCT-SERVICE 👇👇
        /* try {
          // Enviamos patrón { cmd: 'validate_stock' } con timeout
          const isValid = await lastValueFrom(
            this.productsClient.send({ cmd: 'validate_stock' }, { productId: item.productId, quantity: item.quantity })
            .pipe(timeout(5000))
          );

          if (!isValid) {
            throw new BadRequestException(`Stock insuficiente para el producto ID: ${item.productId}`);
          }
        } catch (error) {
          this.logger.error(`Error validando stock: ${error.message}`);
          throw new BadRequestException(`No se pudo validar el stock del producto ${item.productId}. Intente más tarde.`);
        }
        */
        // 👆👆 FIN SECCIÓN COMENTADA 👆👆

        // 👇 SIMULAMOS QUE SIEMPRE HAY STOCK (Solo para pruebas)
        const isValid = true; 
      }
    }

    // --- PASO 2: Calcular Total ---
    const totalAmount = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.price) * Number(item.quantity));
    }, 0);

    // --- PASO 3: Crear el Pedido (Estado inicial: PENDING) ---
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

    // Guardar en BD
    const savedOrder = await this.orderRepository.save(newOrder);

    // --- PASO 4: Actualización de stock (RPC/Event) ---
    // 👇👇 [MODO PRUEBA] COMENTADO PARA NO EMITIR EVENTOS FANTASMA 👇👇
    /*
    items.forEach((item: any) => {
      this.productsClient.emit('reduce_stock', { 
        productId: item.productId, 
        quantity: item.quantity 
      });
    });
    */

    return savedOrder;
  }

  // --- Historial del cliente ---
  async findAllByUser(customer_id: string) {
    return await this.orderRepository.find({
      where: { userId: customer_id },
      relations: ['items'],
      order: { createdAt: 'DESC' } // Ordenar por fecha, más reciente primero
    });
  }

  // --- Actualizar Estado ---
  async updateStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Orden ${id} no encontrada`);
    }

    order.status = status as OrderStatus; 
    return await this.orderRepository.save(order);
  }

  // --- Registro de ventas por puesto ---
  async getStallStats(stallId: string) {
    const { total, count } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .addSelect('COUNT(order.id)', 'count')
      .where('order.stallId = :stallId', { stallId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED }) // Solo contar ventas completadas
      .getRawOne();

    return {
      stallId,
      total_orders: parseInt(count, 10) || 0,
      total_sales: parseFloat(total) || 0,
    };
  }

  // --- Vista Global del Evento con Filtros ---
  async findAllOrdersAdmin(filters: { date?: string; stallId?: string; status?: string }) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    // Filtro por Fecha (YYYY-MM-DD)
    if (filters.date) {
      query.andWhere("order.createdAt::date = :date", { date: filters.date });
    }
    // Filtro por Puesto
    if (filters.stallId) {
      query.andWhere("order.stallId = :stallId", { stallId: filters.stallId });
    }
    // Filtro por Estado
    if (filters.status) {
      query.andWhere("order.status = :status", { status: filters.status });
    }

    return await query.getMany();
  }

  // --- Producto más vendido (Parseado a número) ---
  async getBestSellingProduct() {
    const result = await this.orderRepository.createQueryBuilder('order')
      .leftJoin('order.items', 'item') // Unir con items
      .select('item.productId', 'productId')
      .addSelect('SUM(item.quantity)', 'total_sold')
      .groupBy('item.productId')
      .orderBy('total_sold', 'DESC')
      .limit(1)
      .getRawOne();

    if (!result) return null;

    return {
      productId: result.productId,
      total_sold: parseInt(result.total_sold, 10) || 0
    };
  }

  // --- Volumen total de ventas por día (Parseado a número) ---
  async getDailySalesVolume() {
    const results = await this.orderRepository.createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'YYYY-MM-DD')", 'date') // Agrupa por día
      .addSelect('SUM(order.total)', 'total_sales')
      .where('order.status = :status', { status: OrderStatus.DELIVERED }) // Solo dinero real
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM-DD')")
      .orderBy('date', 'DESC')
      .getRawMany();

    // Mapeamos para devolver números limpios
    return results.map(row => ({
      date: row.date,
      total_sales: parseFloat(row.total_sales) || 0
    }));
  }
}