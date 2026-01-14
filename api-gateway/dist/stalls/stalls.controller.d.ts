import { ClientProxy } from '@nestjs/microservices';
export declare class StallsController {
    private readonly stallsClient;
    constructor(stallsClient: ClientProxy);
    create(createStallDto: any, req: any): import("rxjs").Observable<any>;
    approve(id: string): import("rxjs").Observable<any>;
    disapprove(id: string): import("rxjs").Observable<any>;
    activate(id: string, req: any): import("rxjs").Observable<any>;
    inactivate(id: string, req: any): import("rxjs").Observable<any>;
    update(id: string, body: any, req: any): import("rxjs").Observable<any>;
    remove(id: string, req: any): import("rxjs").Observable<any>;
    findActive(): import("rxjs").Observable<any>;
    findAll(req: any): import("rxjs").Observable<any>;
    findOne(id: string, req: any): import("rxjs").Observable<any>;
}
