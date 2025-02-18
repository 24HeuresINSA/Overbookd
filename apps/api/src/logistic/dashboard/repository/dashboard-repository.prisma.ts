import { PrismaService } from "../../../prisma.service";
import { DashboardGears, GearRequirementForCsv } from "../dashboard.service";
import { SELECT_DASHBOARD_GEAR } from "./dashboard.query";
import { DashboardGear } from "./dashboard-gear";
import { Period } from "@overbookd/time";
import {
  GearPreview,
  GearSearchOptions,
  GearWithDetails,
} from "@overbookd/http";
import { GearFilter } from "../../common/gear.filter";

export class PrismaDashboardGears implements DashboardGears {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_DASHBOARD_GEAR,
    });
    const filteredGears = GearFilter.apply(gears, searchOptions);
    return filteredGears.map(DashboardGear.generatePreview);
  }

  async getDetails(slug: string, period: Period): Promise<GearWithDetails> {
    const gear = await this.prisma.catalogGear.findUnique({
      where: { slug },
      select: SELECT_DASHBOARD_GEAR,
    });
    const details = DashboardGear.generateDetails(gear, period);

    return { name: gear.name, slug: gear.slug, details };
  }

  async getRequirementsForCsv(
    searchOptions: GearSearchOptions,
  ): Promise<GearRequirementForCsv[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_DASHBOARD_GEAR,
    });
    const filteredGears = GearFilter.apply(gears, searchOptions);
    return filteredGears
      .map(DashboardGear.generateRequirementForCsv)
      .filter((requirement) => requirement !== null);
  }
}
