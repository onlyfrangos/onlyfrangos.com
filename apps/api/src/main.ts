import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './shared/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const webPort = process.env.WEB_PORT ?? '3000';
  const webPublicUrl = (process.env.WEB_PUBLIC_URL ?? 'https://onlyfrangos.com').replace(/\/$/, '');
  app.enableCors({
    origin: [webPublicUrl, `http://localhost:${webPort}`, `http://127.0.0.1:${webPort}`],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OnlyFrangos API')
    .setDescription('MVP API for feed and profile')
    .setVersion('0.1.0')
    .addServer(
      (process.env.API_PUBLIC_URL ?? 'https://api.onlyfrangos.com').replace(/\/$/, ''),
      'API pública',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = 3001;
  await app.listen(port);
}

void bootstrap();
