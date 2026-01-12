import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

// Configuraciones y Entidades
import { databaseConfig } from './database/database.config';
import { ApiLog } from './database/api-log.entity';

// Módulos funcionales
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Common (AOP y Errores)
import { LoggingInterceptor } from './common/logging.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

@Module({
  imports: [
    // 1. Conexión global a PostgreSQL
    TypeOrmModule.forRoot(databaseConfig),

    // 2. Registro de la entidad de Logs para que el Interceptor pueda usarla
    TypeOrmModule.forFeature([ApiLog]),

    // 3. Módulos de lógica de negocio
    AuthModule,
    UsersModule,
  ],
  controllers: [], // No hay AppController, la lógica está en los módulos
  providers: [
    // 4. Implementación de Programación Orientada a Aspectos (AOP)
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // Registra cada petición en public.api_logs
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // Estandariza errores y fallos
    },
  ],
})
export class AppModule {}
