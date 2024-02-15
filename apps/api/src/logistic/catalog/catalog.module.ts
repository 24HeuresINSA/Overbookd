import { Module } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { GearController } from "./gear.controller";
import { PrismaService } from "../../prisma.service";
import {
  PrismaCategoryRepository,
  PrismaGearRepository,
  PrismaTeamRepository,
} from "./repositories";

@Module({
  providers: [
    PrismaService,
    CatalogService,
    CategoryService,
    {
      provide: "GEAR_REPOSITORY",
      useClass: PrismaGearRepository,
    },
    {
      provide: "CATEGORY_REPOSITORY",
      useClass: PrismaCategoryRepository,
    },
    {
      provide: "TEAM_REPOSITORY",
      useClass: PrismaTeamRepository,
    },
  ],
  controllers: [CategoryController, GearController],
  exports: [CatalogService, CategoryService],
})
export class CatalogModule {}
