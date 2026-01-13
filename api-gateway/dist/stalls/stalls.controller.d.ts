import { ClientProxy } from '@nestjs/microservices';
export declare class StallsController {
    private readonly stallsClient;
    constructor(stallsClient: ClientProxy);
    create(createStallDto: any, req: any): import("rxjs").Observable<any>;
    findAll(): import("rxjs").Observable<any>;
    findAllActive(): import("rxjs").Observable<any>;
    approve(id: string): import("rxjs").Observable<any>;
    activate(id: string, ownerId: string): import("rxjs").Observable<any>;
    inactivate(id: string, ownerId: string): import("rxjs").Observable<any>;
    update(id: string, body: any): import("rxjs").Observable<any>;
    remove(id: string, ownerId: string): import("rxjs").Observable<any>;
}
