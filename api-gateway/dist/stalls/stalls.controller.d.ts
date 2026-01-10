import { ClientProxy } from '@nestjs/microservices';
export declare class StallsController {
    private readonly stallsClient;
    constructor(stallsClient: ClientProxy);
    create(createStallDto: any, req: any): import("rxjs").Observable<any>;
    findAll(): import("rxjs").Observable<any>;
}
