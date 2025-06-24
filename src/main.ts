import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: '*' });
  await app.listen(process.env.PORT || 3000);
  console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
