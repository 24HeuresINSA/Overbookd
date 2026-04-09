import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConfigurationController } from "./configuration.controller";
import { ConfigurationService } from "./configuration.service";

@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationService, PrismaService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
