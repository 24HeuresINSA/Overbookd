import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "./prisma/generated-client";
import { Prisma } from "./prisma/generated-client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  isUniqueConstraintViolation(e: Error) {
    return (
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
    );
  }
}
