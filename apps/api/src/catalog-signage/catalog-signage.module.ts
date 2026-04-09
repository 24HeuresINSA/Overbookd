import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { FileService } from "../utils/file.service";
import { CatalogSignageController } from "./catalog-signage.controller";
import { CatalogSignageService } from "./catalog-signage.service";
import { PrismaCatalogSignageRepository } from "./repository/catalog-signage-repository.prisma";

@Module({
  controllers: [CatalogSignageController],
  providers: [
    {
      provide: PrismaCatalogSignageRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaCatalogSignageRepository(prisma, new FileService()),
      inject: [PrismaService],
    },
    {
      provide: CatalogSignageService,
      useFactory: (catalogSignages: PrismaCatalogSignageRepository) =>
        new CatalogSignageService(catalogSignages),
      inject: [PrismaCatalogSignageRepository],
    },
  ],
  imports: [PrismaModule],
})
export class CatalogSignageModule {}
