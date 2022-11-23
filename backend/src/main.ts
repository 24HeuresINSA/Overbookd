import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';

const allowedOrigins = [
  'http://localhost:3000',
  'https://overbookd.24heures.org',
  'https://preprod.overbookd.24heures.org',
  'https://overbookd.traefik.me',
  'https://cetaitmieuxavant.24heures.org',
];

const SWAGGER_PROTECT_DOMAINS = [
  'overbookd.24heures.org',
  'preprod.overbookd.24heures.org',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  if (SWAGGER_PROTECT_DOMAINS.includes(process.env.DOMAIN)) {
    app.use(
      '/swagger',
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );
  }
  //Create swagger
  const config = new DocumentBuilder()
    .setTitle('Overbookd')
    .setDescription('The Overbookd API description')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap();
