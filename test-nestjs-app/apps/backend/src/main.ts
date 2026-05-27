import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('test-nestjs-app API')
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀  Server listening on http://localhost:${port}`);
  console.log(`📚  Swagger docs at  http://localhost:${port}/api`);

  if (!process.env.DATABASE_URL) {
    console.error(
      '\n❌  DATABASE_URL not set.\n' +
        '    1. cp apps/backend/.env.example apps/backend/.env\n' +
        '    2. docker-compose up -d postgres\n' +
        '    3. cd apps/backend && npm run prisma:migrate\n',
    );
  }
}

void bootstrap();
