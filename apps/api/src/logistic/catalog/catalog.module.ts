import { Module } from "@nestjs/common";
import { CatalogGearService } from "./gear/gear.service";
import { CatalogCategoryService } from "./category/category.service";
import { CategoryController } from "./category/category.controller";
import { CatalogGearController } from "./gear/gear.controller";
import { PrismaService } from "../../prisma.service";
import { PrismaCatalogGears } from "./gear/repository/catalog-gears.prisma";
import { PrismaCatalogTeams } from "./category/repository/catalog-teams.prisma";
import {
  CatalogCategoryManager,
  CatalogGearManager,
} from "@overbookd/logistic";
import { PrismaFindCatalogCategories } from "./gear/repository/find-catalog-categories.prisma";
import { PrismaCatalogCategories } from "./category/repository/catalog-categories.prisma";
import { PrismaSearchGears } from "../common/search-gears.prisma";
import { SearchGears } from "../common/search-gears";
import { PrismaModule } from "../../prisma.module";

@Module({
  providers: [
    {
      provide: PrismaSearchGears,
      useFactory: (prisma: PrismaService) => new PrismaSearchGears(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaCatalogGears,
      useFactory: (prisma: PrismaService) => new PrismaCatalogGears(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaCatalogCategories,
      useFactory: (prisma: PrismaService) =>
        new PrismaCatalogCategories(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaCatalogTeams,
      useFactory: (prisma: PrismaService) => new PrismaCatalogTeams(prisma),
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
      provide: CatalogCategoryManager,
      useFactory: (
        categories: PrismaCatalogCategories,
        teams: PrismaCatalogTeams,
      ) => new CatalogCategoryManager(categories, teams),
      inject: [PrismaCatalogCategories, PrismaCatalogTeams],
    },
    {
      provide: CatalogGearService,
      useFactory: (
        gears: CatalogGearManager,
        categories: PrismaFindCatalogCategories,
        search: SearchGears,
      ) => new CatalogGearService(gears, categories, search),
      inject: [
        CatalogGearManager,
        PrismaFindCatalogCategories,
        PrismaSearchGears,
      ],
    },
    {
      provide: CatalogCategoryService,
      useFactory: (categories: CatalogCategoryManager) =>
        new CatalogCategoryService(categories),
      inject: [CatalogCategoryManager],
    },
  ],
  controllers: [CategoryController, CatalogGearController],
  exports: [CatalogGearService, CatalogCategoryService],
  imports: [PrismaModule],
})
export class CatalogModule {}
