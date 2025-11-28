import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaClientKnownRequestError } from "./generated/prisma/internal/prismaNamespace";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not defined");
    }

    const adapter = new PrismaPg({ connectionString: url });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  isUniqueConstraintViolation(e: unknown): boolean {
    return e instanceof PrismaClientKnownRequestError && e.code === "P2002";
  }
}
