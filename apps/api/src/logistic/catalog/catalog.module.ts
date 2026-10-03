import { Module } from "@nestjs/common";
import { CatalogGearService } from "./gear/gear.service";
import { CatalogCategoryService } from "./category/category.service";
import { CategoryController } from "./category/category.controller";
import { CatalogGearController } from "./gear/gear.controller";
import { PrismaService } from "../../prisma.service";
import { PrismaCatalogGears } from "./gear/repositories/catalog-gears.prisma";
import { PrismaCategoryRepository } from "./category/repositories/category.repository.prisma";
import { PrismaTeamRepository } from "./category/repositories/team.repository.prisma";
import { CatalogGearManager } from "@overbookd/logistic";
import { PrismaFindCatalogCategories } from "./gear/repositories/find-catalog-categories.prisma";

@Module({
  providers: [
    {
      provide: PrismaCatalogGears,
      useFactory: (prisma: PrismaService) => new PrismaCatalogGears(prisma),
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
      provide: PrismaFindCatalogCategories,
      useFactory: (prisma: PrismaService) =>
        new PrismaFindCatalogCategories(prisma),
      inject: [PrismaService],
    },
    {
      provide: CatalogGearManager,
      useFactory: (gears: PrismaCatalogGears) => new CatalogGearManager(gears),
      inject: [PrismaCatalogGears],
    },
    {
      provide: CatalogGearService,
      useFactory: (
        gears: CatalogGearManager,
        categories: PrismaFindCatalogCategories,
      ) => new CatalogGearService(gears, categories),
      inject: [CatalogGearManager, PrismaFindCatalogCategories],
    },
    {
      provide: CatalogCategoryService,
      useFactory: (
        category: PrismaCategoryRepository,
        team: PrismaTeamRepository,
      ) => new CatalogCategoryService(category, team),
      inject: [PrismaCategoryRepository, PrismaTeamRepository],
    },
  ],
  controllers: [CategoryController, CatalogGearController],
  exports: [CatalogGearService, CatalogCategoryService],
})
export class CatalogModule {}
