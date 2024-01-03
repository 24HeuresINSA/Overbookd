import { SummaryGearPreview } from "@overbookd/http";
import { PrismaService } from "../../prisma.service";
import { SummaryGears } from "../summary-gear.service";
import { SELECT_GEAR_PREVIEW } from "./summary-gear.query";

type DatabaseGearPreview = Omit<SummaryGearPreview, "delta">;

export class PrismaSummaryGears implements SummaryGears {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_GEAR_PREVIEW,
    });
    return gears.map(this.formatGearPreview);
  }

  private async formatGearPreview(
    gear: DatabaseGearPreview,
  ): Promise<SummaryGearPreview> {
    return { ...gear, delta: 0 }; // TODO: implement delta
  }
}
