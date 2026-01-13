import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersClient;
    constructor(ordersClient: ClientProxy);
    createOrder(createOrderDto: CreateOrderDto): import("rxjs").Observable<any>;
    getUserOrders(id: string): import("rxjs").Observable<any>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): import("rxjs").Observable<any>;
    getStallStats(id: string): import("rxjs").Observable<any>;
}
