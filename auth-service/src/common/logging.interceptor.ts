import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from '../database/api-log.entity';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(ApiLog)
    private readonly logRepository: Repository<ApiLog>,
  ) {}

intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType();
    let route = 'UNKNOWN';
    let method = 'TCP';
    let userId: string | null = null;

    // ACTUALIZACIÓN: Lógica de extracción de metadatos según el contexto
    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      route = request.url;
      method = request.method;
      userId = request.user?.id || null;
    } else if (type === 'rpc') {
      const data = context.switchToRpc().getData();
      // Extraemos el patrón del mensaje (ej: {cmd: 'login'})
      const contextRpc = context.switchToRpc().getContext();
      try {
        // En NestJS TCP, el pattern suele venir en el contexto
        route = JSON.stringify(contextRpc.getPattern() || 'RPC_ACTION');
      } catch {
        route = 'RPC_ACTION';
      }
      userId = data?.id || data?.userId || null;
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          // ACTUALIZACIÓN CLAVE: Si la respuesta (data) contiene un usuario, extraemos ese ID
          // Esto permite que en el Login, una vez que el servicio termina, el log capture el ID generado.
          const finalUserId = userId || data?.user?.id || data?.id || null;

          const log = this.logRepository.create({
            route,
            method,
            userId: finalUserId, // Ahora usamos el ID que viene de la respuesta del login
            statusCode: 200,
            message: 'Success',
            timestamp: new Date(),
          });

          this.logRepository.save(log).catch(err => console.error('Error log:', err));
        },
        error: (err) => {
          const logEntry = {
            route,
            method,
            userId,
            statusCode: err.status || 500,
            message: err.message || 'Error',
            timestamp: new Date(),
          };

          const log = this.logRepository.create(logEntry);
          this.logRepository.save(log).catch(errLog => 
            console.error('Error persistiendo log de error:', errLog)
            );
        },
      }),
    );
  }
}
