import { SummaryGearPreview } from "@overbookd/http";
import { PrismaService } from "../../prisma.service";
import { SummaryGears } from "../summary-gear.service";
import { SELECT_GEAR_PREVIEW } from "./summary-gear.query";
import { SummaryGear } from "./summary-gear";

export class PrismaSummaryGears implements SummaryGears {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_GEAR_PREVIEW,
    });
    return gears.map(SummaryGear.generatePreview);
  }
}
