import { Injectable } from "@nestjs/common";
import { SummaryGearPreview } from "@overbookd/http";

export interface SummaryGears {
  findAll(): Promise<SummaryGearPreview[]>;
}

@Injectable()
export class SummaryGearService {
  constructor(private readonly summaryGears: SummaryGears) {}

  async findAll(): Promise<SummaryGearPreview[]> {
    return this.summaryGears.findAll();
  }
}
