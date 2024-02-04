import { PrismaService } from "../../../prisma.service";
import { DashboardGears } from "../dashboard.service";
import { SELECT_GEAR } from "./dashboard.query";
import { DashboardGear } from "./dashboard-gear";
import { Period } from "@overbookd/period";
import { GearDetails, GearPreview, GearSearchOptions } from "@overbookd/http";

export class PrismaDashboardGears implements DashboardGears {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]> {
    const where = this.buildSearchConditions(searchOptions);
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_GEAR,
      where,
    });
    return gears.map(DashboardGear.generatePreview);
  }

  async getDetails(slug: string, period: Period): Promise<GearDetails[]> {
    const gears = await this.prisma.catalogGear.findUnique({
      where: { slug },
      select: SELECT_GEAR,
    });
    return DashboardGear.generateDetails(gears, period);
  }

  private buildSearchConditions({ name, category, owner }: GearSearchOptions) {
    const slugCondition = name ? { slug: { contains: name } } : {};
    const categoryCondition = this.buildCategorySearchCondition(
      category,
      owner,
    );

    return {
      ...slugCondition,
      ...categoryCondition,
    };
  }

  private buildCategorySearchCondition(category: string, owner: string) {
    if (!owner && !category) return {};

    const baseCategoryNameCondition = category
      ? { path: { contains: category } }
      : {};
    const baseCategoryOwnerCondition = owner
      ? { owner: { code: { contains: owner } } }
      : {};

    return {
      category: {
        ...baseCategoryNameCondition,
        ...baseCategoryOwnerCondition,
      },
    };
  }
}
