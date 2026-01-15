import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
export declare class OrdersController {
    private readonly ordersClient;
    constructor(ordersClient: ClientProxy);
    createOrder(createOrderDto: CreateOrderDto, req: any): import("rxjs").Observable<any>;
    getUserOrders(id: string, req: any): import("rxjs").Observable<any>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): import("rxjs").Observable<any>;
    getStallStats(id: string): import("rxjs").Observable<any>;
    getAnalytics(filterDto: OrderFilterDto): import("rxjs").Observable<any>;
    findAllAdmin(): import("rxjs").Observable<any>;
    findBestSeller(): import("rxjs").Observable<any>;
    findDailyVolume(): import("rxjs").Observable<any>;
}
