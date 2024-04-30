import { Injectable } from "@nestjs/common";
import { VolunteerForPlanning } from "@overbookd/http";
import { Period } from "@overbookd/period";
import { BreakDefinition, BreakPeriods } from "@overbookd/planning";

export type Volunteers = {
  all(): Promise<VolunteerForPlanning[]>;
};

@Injectable()
export class PlanningService {
  constructor(
    private readonly breaks: BreakPeriods,
    private readonly volunteers: Volunteers,
  ) {}

  async getBreakPeriods(volunteer: number) {
    return this.breaks.of(volunteer);
  }

  async addBreakPeriod(breakDefinition: BreakDefinition) {
    return this.breaks.for(breakDefinition);
  }

  removeBreakPeriod(volunteer: number, period: Period) {
    return this.breaks.remove({ volunteer, period });
  }

  getVolunteers() {
    return this.volunteers.all();
  }
}
