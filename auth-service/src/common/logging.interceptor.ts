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
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      tap(() => {
        const log = this.logRepository.create({
          userId: request?.user?.id || null,
          action: request?.method || 'TCP_ACTION',
          // Se elimina 'route' porque no existe en tu entidad DeepPartial<ApiLog>
          timestamp: new Date(),
        });
        this.logRepository.save(log).catch(err => console.error('Error saving log:', err));
      }),
    );
  }
}
