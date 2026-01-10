import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(data: any) {
    const { items, customer_id } = data;

    // Calculamos el total asegurando que los valores sean números
    const totalAmount = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.price) * Number(item.quantity));
    }, 0);

    // Creamos la orden vinculando el ID del cliente a la propiedad de la entidad
    const newOrder = this.orderRepository.create({
      userId: customer_id, 
      stallId: items[0]?.stallId,
      total: totalAmount,
      status: 'pendiente',
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    // Esto guardará en la tabla 'orders' y en 'order_items' por el cascade
    return await this.orderRepository.save(newOrder);
  }

  async findAllByUser(customer_id: string) {
    return await this.orderRepository.find({
      where: { userId: customer_id },
      relations: ['items'],
    });
  }
}