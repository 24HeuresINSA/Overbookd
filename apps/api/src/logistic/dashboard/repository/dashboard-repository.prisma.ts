import { PrismaService } from "../../../prisma.service";
import { DashboardGears, GearRequirementForCsv } from "../dashboard.service";
import { SELECT_DASHBOARD_GEAR } from "./dashboard.query";
import { DashboardGear } from "../domain/dashboard-gear";
import { Period } from "@overbookd/time";
import { GearPreview, GearWithDetails } from "@overbookd/http";
import { GearSearchOptions } from "@overbookd/logistic";
import { filterGears } from "../../common/gear-search.builder";

export class PrismaDashboardGears implements DashboardGears {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_DASHBOARD_GEAR,
    });
    const filteredGears = filterGears(gears, searchOptions);
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

  async getRequirementsForCsv(): Promise<GearRequirementForCsv[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_DASHBOARD_GEAR,
    });
    return gears
      .map(DashboardGear.generateRequirementForCsv)
      .filter((requirement) => requirement !== null);
  }
}
