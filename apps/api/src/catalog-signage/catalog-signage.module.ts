import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CatalogSignageController } from "./catalog-signage.controller";
import { CatalogSignageService } from "./catalog-signage.service";

@Module({
  controllers: [CatalogSignageController],
  providers: [CatalogSignageService, PrismaService],
})
export class CatalogSignageModule {}
