import { PrismaService } from "../../../prisma.service";
import { DashboardGears } from "../dashboard.service";
import { SELECT_GEAR } from "./dashboard.query";
import { DashboardGear } from "./dashboard-gear";
import { Period } from "@overbookd/time";
import {
  GearPreview,
  GearSearchOptions,
  GearWithDetails,
} from "@overbookd/http";
import { GearQueryBuilder } from "../../common/repositories/gear.query";

export class PrismaDashboardGears implements DashboardGears {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]> {
    const where = GearQueryBuilder.find(searchOptions);
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_GEAR,
      where,
    });
    return gears.map(DashboardGear.generatePreview);
  }

  async getDetails(slug: string, period: Period): Promise<GearWithDetails> {
    const gear = await this.prisma.catalogGear.findUnique({
      where: { slug },
      select: SELECT_GEAR,
    });
    const details = DashboardGear.generateDetails(gear, period);

    return { name: gear.name, slug: gear.slug, details };
  }
}
