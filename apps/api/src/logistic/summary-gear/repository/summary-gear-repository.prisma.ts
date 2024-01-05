import { SummaryGearDetails, SummaryGearPreview } from "@overbookd/http";
import { PrismaService } from "../../../prisma.service";
import { SummaryGears } from "../summary-gear.service";
import { SELECT_GEAR } from "./summary-gear.query";
import { SummaryGear } from "./summary-gear";

export class PrismaSummaryGears implements SummaryGears {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_GEAR,
    });
    return gears.map(SummaryGear.generatePreview);
  }

  async findOne(slug: string): Promise<SummaryGearDetails[]> {
    const gears = await this.prisma.catalogGear.findUnique({
      where: { slug },
      select: SELECT_GEAR,
    });
    return SummaryGear.generateDetails(gears);
  }
}
