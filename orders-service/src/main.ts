import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // 1. Primero cargamos el contexto para leer el ConfigService
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  // 2. Obtenemos el puerto y host del .env (o usamos valores por defecto)
  const port = configService.get('TCP_PORT') || 3002;
  const host = configService.get('TCP_HOST') || 'localhost';

  // 3. Cerramos el contexto temporal
  await appContext.close();

  // 4. Iniciamos el Microservicio real
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // '0.0.0.0' es más seguro para evitar problemas de red local
        port: Number(port),
      },
    },
  );

  await app.listen();
  console.log(`🚀 Orders-Service (TCP) listo y escuchando en ${host}:${port}`);
}
bootstrap();