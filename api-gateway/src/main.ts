import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/rpc-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // <--- 1. Importar esto

async function bootstrap() {
  const logger = new Logger('Main-Gateway');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  // 👇 2. AGREGAR ESTE BLOQUE DE AQUÍ PARA ABAJO 👇
  const config = new DocumentBuilder()
    .setTitle('Sistema de Ferias Gastronómicas')
    .setDescription('Documentación del API Gateway')
    .setVersion('1.0')
    .addTag('Orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // 👆 FIN DEL BLOQUE NUEVO 👆

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  logger.log(`API Gateway running on: http://localhost:${PORT}/api`);
  logger.log(`Swagger Docs available at: http://localhost:${PORT}/api/docs`);
}

bootstrap();