import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as fileUpload from 'fastify-file-upload';
import * as helmet from 'fastify-helmet';
import { AppModule } from './app.module';

export async function bootstrap() {

  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.register(fileUpload, {
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  fastifyAdapter.register(helmet);

  const app = await NestFactory.create(
    AppModule,
    fastifyAdapter,
  );

  app.enableCors();
  await app.listen(3000, '0.0.0.0', () => {});

}
bootstrap();
