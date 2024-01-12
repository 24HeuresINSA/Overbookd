import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import basicAuth from "express-basic-auth";
import { ValidationPipe } from "@nestjs/common";
import { json, urlencoded } from "body-parser";
import { RouteLoggerInterceptor } from "./route-logger.interceptor";

const SWAGGER_PROTECT_DOMAINS = [
  "overbookd.24heures.org",
  "preprod.overbookd.24heures.org",
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new RouteLoggerInterceptor());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.includes(process.env.DOMAIN)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  });

  if (SWAGGER_PROTECT_DOMAINS.includes(process.env.DOMAIN)) {
    app.use(
      "/swagger",
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
    .setTitle("Overbookd")
    .setDescription("The Overbookd API description")
    .setVersion("1.0")
    .addServer("/api")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document, {
    swaggerOptions: {
      docExpansion: "none",
    },
  });

  app.use(json({ limit: "200kb" }));
  app.use(urlencoded({ limit: "200kb", extended: true }));

  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
