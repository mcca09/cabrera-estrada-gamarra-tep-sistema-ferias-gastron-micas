import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => console.log(`[LOG] ${new Date().toISOString()} | ${method} ${url} | User: ${user?.email || 'Public'} | Role: ${user?.role || 'None'} | Success | ${Date.now() - now}ms`),
        error: (err) => console.error(`[LOG] ${new Date().toISOString()} | ${method} ${url} | User: ${user?.email || 'Public'} | Error: ${err.message} | ${Date.now() - now}ms`),
      }),
    );
  }
}