import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StallOwnershipGuard implements CanActivate {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    @Inject('STALLS_SERVICE') private readonly stallsClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 
    const { method, params, body } = request;

    let stallId = null;

    // Caso Creación
    if (method === 'POST') {
      stallId = body.stall_id;
    } 
    // Caso Actualización o Eliminación 
    else if (method === 'PATCH' || method === 'DELETE') {
      const productId = params.id;
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'get_product_by_id' }, productId),
      );

      if (!product) throw new NotFoundException('Producto no encontrado');
      
      stallId = product.stall_id;
      request.product = product;
    }

    if (!stallId) return false;

    const ownershipResponse = await firstValueFrom(
      this.stallsClient.send(
        { cmd: 'verify_stall_ownership' },
        { userId: user.id, stall_id: stallId },
      ),
    );

    if (!ownershipResponse || !ownershipResponse.valid) {
      throw new ForbiddenException(
        ownershipResponse?.message || 'No tienes permiso sobre este puesto.',
      );
    }

    return true;
  }
}