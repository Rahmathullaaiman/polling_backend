/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SecurityInterceptor } from './common/interceptors/security.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalInterceptors(new SecurityInterceptor());

  const PORT = process.env.PORT || 10000;
  await app.listen(PORT);

  console.log(`🚀 Server is running at http://localhost:${PORT}`);
}
bootstrap();
