import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "./prisma/generated";
import { Prisma } from "./prisma/generated";

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
