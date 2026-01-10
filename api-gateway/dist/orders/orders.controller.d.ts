import { ClientProxy } from '@nestjs/microservices';
export declare class OrdersController {
    private readonly ordersClient;
    constructor(ordersClient: ClientProxy);
    createOrder(createOrderDto: any, req: any): Promise<import("rxjs").Observable<any>>;
    getMyOrders(req: any): Promise<import("rxjs").Observable<any>>;
}
