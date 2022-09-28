import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
function initializeTransactionalContext() {
  throw new Error('Function not implemented.');
}
function patchTypeORMRepositoryWithBaseRepository() {
  throw new Error('Function not implemented.');
}
