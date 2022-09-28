import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  await app.useLogger(app.get(Logger));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
