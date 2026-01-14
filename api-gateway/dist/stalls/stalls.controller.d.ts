import { ClientProxy } from '@nestjs/microservices';
export declare class StallsController {
    private readonly stallsClient;
    constructor(stallsClient: ClientProxy);
    create(createStallDto: any, req: any): import("rxjs").Observable<any>;
    findAll(): import("rxjs").Observable<any>;
    approve(id: string): import("rxjs").Observable<any>;
    activate(id: string, req: any): import("rxjs").Observable<any>;
    inactivate(id: string, req: any): import("rxjs").Observable<any>;
    update(id: string, updateData: any, req: any): import("rxjs").Observable<any>;
    remove(id: string, req: any): import("rxjs").Observable<any>;
}
