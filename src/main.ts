import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true, bufferLogs: true },
  );

  await app.register(helmet);
  await await app.register(compression, { encodings: ['gzip', 'deflate'] });

  await app.useLogger(app.get(Logger));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
