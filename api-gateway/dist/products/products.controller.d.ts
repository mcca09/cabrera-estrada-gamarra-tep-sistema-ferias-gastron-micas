import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
export declare class ProductsController {
    private readonly productsClient;
    constructor(productsClient: ClientProxy);
    getPublicCatalog(stall_id?: string, minPrice?: number, maxPrice?: number): Observable<any>;
    create(createProductDto: any): Observable<any>;
    findAll(): Observable<any>;
    findOne(id: string): Observable<any>;
    update(id: string, updateProductDto: any): Observable<any>;
    remove(id: string): Observable<any>;
}
