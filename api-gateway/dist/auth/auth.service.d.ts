import { ClientProxy } from '@nestjs/microservices';
export interface UserPayload {
    id: string;
    email: string;
    role: string;
}
export declare class AuthService {
    private readonly authClient;
    constructor(authClient: ClientProxy);
    validateToken(token: string): Promise<UserPayload>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, updateData: any): Promise<any>;
}
