import { SummaryGearPreview } from "@overbookd/http";
import { PrismaService } from "../../prisma.service";
import { SummaryGears } from "../summary-gear.service";

export class PrismaSummaryGears implements SummaryGears {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    return this.prisma.catalogGear.findMany();
  }
}
