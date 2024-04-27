import { Injectable } from "@nestjs/common";
import { Period } from "@overbookd/period";
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

  removeBreakPeriod(volunteer: number, period: Period) {
    return this.breaks.remove({ volunteer, period });
  }
}
