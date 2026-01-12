import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async validateToken(token: string): Promise<UserPayload> {
    return firstValueFrom(
      this.authClient.send({ cmd: 'validate_token' }, { token }),
    );
  }

  // ANEXO: Método opcional para centralizar llamadas de perfil si se prefiere no usar el proxy en el controller
  async getProfile(userId: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_profile' }, { id: userId }),
    );
  }

  // ACTUALIZACIÓN: Ajustado para enviar los datos bajo la llave 'updateData'
  // permitiendo que el microservicio reciba email, password, fullName y role.
  async updateProfile(userId: string, updateData: any) {
    return firstValueFrom(
      this.authClient.send(
        { cmd: 'update_profile' }, 
        { id: userId, updateData } // Cambiado para mantener consistencia con el controller
      ),
    );
  }
}