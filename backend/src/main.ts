import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Create swagger
  const config = new DocumentBuilder()
    .setTitle('Overbookd')
    .setDescription('The Overbookd API description')
    .setVersion('1.0')
    .addServer('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap();
