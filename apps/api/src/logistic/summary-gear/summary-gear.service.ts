import { Injectable } from "@nestjs/common";
import { SummaryGearDetails, SummaryGearPreview } from "@overbookd/http";
import { Period } from "@overbookd/period";

export interface SummaryGears {
  findAll(): Promise<SummaryGearPreview[]>;
  findOne(slug: string, period: Period): Promise<SummaryGearDetails[]>;
}

@Injectable()
export class SummaryGearService {
  constructor(private readonly summaryGears: SummaryGears) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    return this.summaryGears.findAll();
  }

  async findOne(
    slug: string,
    start: Date,
    end: Date,
  ): Promise<SummaryGearDetails[]> {
    const period = Period.init({ start: new Date(start), end: new Date(end) });
    return this.summaryGears.findOne(slug, period);
  }
}
