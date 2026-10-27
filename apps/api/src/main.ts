import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import basicAuth from "express-basic-auth";
import { ValidationPipe } from "@nestjs/common";
import { RouteLoggerInterceptor } from "./route-logger.interceptor";
import { HttpExceptionFilter } from "./http-exception.filter";
import { PeriodErrorFilter } from "./period.filter";

const SWAGGER_PROTECT_DOMAINS = [
  "overbookd.24heures.org",
  "preprod.overbookd.24heures.org",
];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    routeConflictPolicy: { duplicate: "error", shadow: "warn" },
    routeResolutionStrategy: "specificity",
  });
  app.useBodyParser("json", { limit: "200kb" });
  app.useBodyParser("urlencoded", { limit: "200kb", extended: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new RouteLoggerInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new PeriodErrorFilter());
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
    .setDescription("Overbookd API documentation")
    .setVersion("1.0")
    .addServer("/ob-api")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document, {
    swaggerOptions: {
      docExpansion: "none",
    },
  });

  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
