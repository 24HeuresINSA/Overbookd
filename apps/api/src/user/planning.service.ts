import { Injectable } from "@nestjs/common";
import { BreakDefinition, BreakPeriods } from "@overbookd/planning";

@Injectable()
export class PlanningService {
  constructor(private readonly breaks: BreakPeriods) {}

  async getBreakPeriods(volunteer: number) {
    return this.breaks.of(volunteer);
  }

  async addBreakPeriod(breakDefinition: BreakDefinition) {
    return this.breaks.for(breakDefinition);
  }
}
