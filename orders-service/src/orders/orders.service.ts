import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
// 👇 Importaciones nuevas para comunicarnos con otros microservicios
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    
    // 👇 Inyectamos el cliente PRODUCTS_SERVICE
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  // --- TU LÓGICA CON VALIDACIÓN DE STOCK ---
  async create(data: any) {
    const { items, customer_id } = data;

    // 1. 🔍 PASO PREVIO: Validar Stock con el Microservicio de Productos
    // Recorremos cada item del pedido para ver si hay existencias
    if (items && items.length > 0) {
      for (const item of items) {
        try {
          // Enviamos mensaje: { cmd: 'validate_stock' }
          const validStock = await lastValueFrom(
            this.productsClient.send(
              { cmd: 'validate_stock' }, 
              { productId: item.productId, quantity: item.quantity }
            )
          );

          if (!validStock) {
            throw new BadRequestException(`Stock insuficiente para el producto ID: ${item.productId}`);
          }
        } catch (error) {
          throw new BadRequestException(`Error verificando stock del producto ${item.productId}: ${error.message}`);
        }
      }
    }

    // 2. CALCULAR TOTAL (Tu lógica original)
    const totalAmount = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.price) * Number(item.quantity));
    }, 0);

    // 3. CREAR LA ORDEN (Tu lógica original)
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

    // Guardamos en Base de Datos
    const savedOrder = await this.orderRepository.save(newOrder);

    // 4. 📉 RESTAR STOCK (RPC - Evento)
    // Una vez guardada la orden, le decimos a productos que baje el inventario real.
    // Usamos un bucle para notificar la reducción de cada item.
    items.forEach((item: any) => {
      this.productsClient.emit('reduce_stock', { 
        productId: item.productId, 
        quantity: item.quantity 
      });
    });

    return savedOrder;
  }

  async findAllByUser(customer_id: string) {
    return await this.orderRepository.find({
      where: { userId: customer_id },
      relations: ['items'],
    });
  }

  // --- MÉTODOS EXTRAS (PATCH Y STATS) ---

  async updateStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Orden ${id} no encontrada`);
    }

    order.status = status as OrderStatus; 
    return await this.orderRepository.save(order);
  }

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
}