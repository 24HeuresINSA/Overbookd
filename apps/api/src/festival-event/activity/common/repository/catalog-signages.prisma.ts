import { PrismaService } from "../../../../prisma.service";
import { CatalogSignages } from "../festival-activity-common.model";
import { SELECT_CATALOG_SIGNAGE } from "./catalog-signage.query";

export class PrismaCatalogSignages implements CatalogSignages {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: number) {
    return this.prisma.catalogSignage.findFirst({
      where: { id },
      select: SELECT_CATALOG_SIGNAGE,
    });
  }
}
