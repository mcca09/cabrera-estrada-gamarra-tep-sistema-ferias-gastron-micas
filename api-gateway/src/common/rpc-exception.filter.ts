import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    // Permitimos que message sea string o array de strings
    let message: string | string[] = 'Internal server error'; 

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      // ESTA ES LA CORRECCIÓN CLAVE:
      // Verificamos si la respuesta interna tiene un mensaje detallado (array de errores)
      if (typeof errorResponse === 'object' && errorResponse !== null && (errorResponse as any).message) {
        message = (errorResponse as any).message;
      } else {
        // Si no hay detalles, usamos el mensaje genérico
        message = exception.message;
      }
    }
    // Lógica para errores que no son HTTP estándar (ej. Microservicios)
    else if (exception && typeof exception.status === 'number') {
      status = exception.status;
      message = exception.message || message;
    }
    else if (exception && exception.error) {
      message = typeof exception.error === 'string' ? exception.error : JSON.stringify(exception.error);
    }
    else if (exception && exception.message) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message, // Ahora esto podrá ser un array con los errores específicos
    });
  }
}