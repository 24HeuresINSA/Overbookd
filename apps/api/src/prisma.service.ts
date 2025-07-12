import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaClientKnownRequestError } from "./generated/prisma/internal/prismaNamespace";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  isUniqueConstraintViolation(e: Error) {
    return e instanceof PrismaClientKnownRequestError && e.code === "P2002";
  }
}
