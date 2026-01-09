import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user } = req; 
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logAction(url, method, user?.id, 201, 'Transacción de pedido procesada');
        },
        error: (err) => {
          this.logAction(
            url, 
            method, 
            user?.id, 
            err.status || 500, 
            `Error en pedido: ${err.message}`
          );
        },
      }),
    );
  }

  private async logAction(route: string, method: string, userId: string, status: number, msg: string) {
    try {
      // Inserción directa en la tabla de logs del microservicio de órdenes
      await this.dataSource.query(
        `INSERT INTO api_logs (route, method, user_id, status_code, message) 
         VALUES ($1, $2, $3, $4, $5)`,
        [route, method, userId || null, status, msg]
      );
    } catch (error) {
      console.error('Error crítico al guardar log de órdenes:', error);
    }
  }
}