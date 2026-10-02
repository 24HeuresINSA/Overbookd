import { Module } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { GearController } from "./gear.controller";
import { PrismaService } from "../../prisma.service";
import { PrismaGearRepository } from "./repositories/gear.repository.prisma";
import { PrismaCategoryRepository } from "./repositories/category.repository.prisma";
import { PrismaTeamRepository } from "./repositories/team.repository.prisma";

@Module({
  providers: [
    {
      provide: PrismaGearRepository,
      useFactory: (prisma: PrismaService) => new PrismaGearRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaCategoryRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaCategoryRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaTeamRepository,
      useFactory: (prisma: PrismaService) => new PrismaTeamRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: CatalogService,
      useFactory: (
        gear: PrismaGearRepository,
        category: PrismaCategoryRepository,
      ) => new CatalogService(gear, category),
      inject: [PrismaGearRepository, PrismaCategoryRepository],
    },
  ],
  controllers: [CategoryController, GearController],
  exports: [CatalogService, CategoryService],
})
export class CatalogModule {}
