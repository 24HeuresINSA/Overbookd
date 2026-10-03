import { Injectable } from "@nestjs/common";
import { FindCatalogCategories } from "../gear.service";
import { PrismaService } from "../../../../prisma.service";
import { SELECT_CATALOG_CATEGORY } from "../../category/repositories/category.query";

@Injectable()
export class PrismaFindCatalogCategories implements FindCatalogCategories {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(categoryId: number) {
    return this.prismaService.catalogCategory.findUnique({
      where: { id: categoryId },
      select: SELECT_CATALOG_CATEGORY,
    });
  }
}
