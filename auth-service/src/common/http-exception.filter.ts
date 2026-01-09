import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class HttpExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const errorResponse = {
      statusCode: exception?.status || 500,
      timestamp: new Date().toISOString(),
      message: exception?.response?.message || exception?.message || 'Internal server error',
    };

    return throwError(() => errorResponse);
  }
}