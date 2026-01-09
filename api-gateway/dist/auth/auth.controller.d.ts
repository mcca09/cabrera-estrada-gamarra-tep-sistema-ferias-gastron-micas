import { ClientProxy } from '@nestjs/microservices';
export declare class AuthController {
    private readonly authClient;
    constructor(authClient: ClientProxy);
    register(registerDto: any): import("rxjs").Observable<any>;
    login(loginDto: any): Promise<any>;
    getProfile(req: any): import("rxjs").Observable<any>;
    updateProfile(req: any, updateData: any): import("rxjs").Observable<any>;
}
