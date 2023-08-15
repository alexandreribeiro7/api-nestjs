/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
  .setTitle('Login api')
  .setDescription('api swagger')
  .setVersion('1.0')
  .addTag('tags')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  //app.useGlobalInterceptors(new LogInterceptor());

  await app.listen(3000);
}
bootstrap();
