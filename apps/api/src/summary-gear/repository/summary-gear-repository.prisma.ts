import { SummaryGearPreview } from "@overbookd/http";
import { PrismaService } from "../../prisma.service";
import { SummaryGears } from "../summary-gear.service";
import { SELECT_GEAR_PREVIEW } from "./summary-gear.query";
import { IProvidePeriod, ONE_MINUTE_IN_MS } from "@overbookd/period";

type WithDatabaseInventory = {
  inventoryRecords: { quantity: number }[];
};

type DatabaseInquiry = {
  quantity: number;
  fa: { inquiryTimeWindows: IProvidePeriod[] };
};

type WithDatabaseInquiries = {
  inquiries: DatabaseInquiry[];
};

type DatabaseGearPreview = Omit<SummaryGearPreview, "minDelta"> &
  WithDatabaseInventory &
  WithDatabaseInquiries;

export class PrismaSummaryGears implements SummaryGears {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    const gears = await this.prisma.catalogGear.findMany({
      select: SELECT_GEAR_PREVIEW,
    });
    return gears.map(this.formatGearPreview);
  }

  private formatGearPreview(gear: DatabaseGearPreview): SummaryGearPreview {
    const minDelta = this.calculeMinDelta(gear);
    return { ...gear, minDelta };
  }

  private calculeMinDelta(gear: DatabaseGearPreview): number {
    let minDelta = Infinity;

    gear.inquiries.map((inquiry) => {
      inquiry.fa.inquiryTimeWindows.map(({ start, end }) => {
        minDelta = this.calculeMinDeltaByDate(minDelta, gear, inquiry, start);

        const timeInterval = 15 * ONE_MINUTE_IN_MS;
        for (
          let currentTime = start.getTime();
          currentTime <= end.getTime();
          currentTime += timeInterval
        ) {
          const date = new Date(currentTime);
          minDelta = this.calculeMinDeltaByDate(minDelta, gear, inquiry, date);
        }
      });
    });

    return minDelta === Infinity ? 0 : minDelta;
  }

  private calculeMinDeltaByDate(
    currentDelta: number,
    gear: DatabaseGearPreview,
    inquiry: DatabaseInquiry,
    date: Date,
  ) {
    const stock = this.findStockByDate(gear, date);
    const newDelta = stock - inquiry.quantity;

    return Math.min(currentDelta, newDelta);
  }

  private findStockByDate(gear: DatabaseGearPreview, date: Date): number {
    console.log(date);
    return gear.inventoryRecords
      .map(({ quantity }) => quantity)
      .reduce((total, quantity) => total + quantity, 0);
  }
}
