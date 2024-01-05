import { Injectable } from "@nestjs/common";
import { SummaryGearDetails, SummaryGearPreview } from "@overbookd/http";

export interface SummaryGears {
  findAll(): Promise<SummaryGearPreview[]>;
  findOne(slug: string): Promise<SummaryGearDetails[]>;
}

@Injectable()
export class SummaryGearService {
  constructor(private readonly summaryGears: SummaryGears) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    return this.summaryGears.findAll();
  }

  async findOne(slug: string): Promise<SummaryGearDetails[]> {
    return this.summaryGears.findOne(slug);
  }
}
