import { ClientProxy } from '@nestjs/microservices';
export declare class ProductsController {
    private readonly productsClient;
    constructor(productsClient: ClientProxy);
    findAll(): import("rxjs").Observable<any>;
    create(createProductDto: any): import("rxjs").Observable<any>;
    findOne(id: string): import("rxjs").Observable<any>;
}
