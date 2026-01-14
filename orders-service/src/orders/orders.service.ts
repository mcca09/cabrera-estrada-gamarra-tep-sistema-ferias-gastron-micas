import { Inject,Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
// Importamos Order y OrderStatus como lo tenías
import { Order, OrderStatus } from './order.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>, 
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy, 
  ) {}


  async create(data: any) {
    const { items, customer_id, stall_id } = data;

    //Esto fue lo nuevo que agregue, la lógica de validación y creación
    const validation = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_and_update_stock' }, { stall_id, items })
    );

    if (!validation.success) {
      throw new RpcException({status: 400,message: validation.message || 'Error en validación de productos o stock'});
    }

    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const newOrder = this.orderRepository.create({
      userId: customer_id,
      stallId: stall_id,
      total: totalAmount,
      status: OrderStatus.PENDING,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return await this.orderRepository.save(newOrder);
  }

  async findAllByUser(customer_id: string) {
    return await this.orderRepository.find({
      where: { userId: customer_id }, 
      relations: ['items'],
    });
  }

  
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