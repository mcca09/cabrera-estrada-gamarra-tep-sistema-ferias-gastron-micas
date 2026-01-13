import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authClient;
    constructor(authClient: ClientProxy);
    register(registerDto: RegisterDto): Promise<import("rxjs").Observable<any>>;
    login(loginDto: any): Promise<any>;
    updateProfile(req: any, updateData: any): import("rxjs").Observable<any>;
    deleteProfile(req: any, deleteData: any): import("rxjs").Observable<any>;
}
