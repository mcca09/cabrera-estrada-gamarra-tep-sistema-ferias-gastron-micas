import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
export declare class ProductsController {
    private readonly productsClient;
    private readonly stallsClient;
    constructor(productsClient: ClientProxy, stallsClient: ClientProxy);
    getPublicCatalog(stall_id?: string, category?: string, minPrice?: number, maxPrice?: number): Promise<any>;
    create(createProductDto: any): Observable<any>;
    findAll(): Observable<any>;
    findOne(id: string): Observable<any>;
    update(id: string, updateProductDto: any): Observable<any>;
    remove(id: string): Observable<any>;
}
