import { Injectable } from "@nestjs/common";
import { PlanningTask, VolunteerForPlanning } from "@overbookd/http";
import { Period } from "@overbookd/period";
import { BreakDefinition, BreakPeriods } from "@overbookd/planning";
import { Planning } from "./domain/planning";
import { Task } from "./domain/task.model";
import { SubscriptionService } from "./subscription.service";
import { UserName } from "@overbookd/user";

export type Volunteers = {
  all(): Promise<VolunteerForPlanning[]>;
  find(volunteerId: number): Promise<UserName | null>;
};

type VolunteerWithTasks = {
  tasks: Task[];
  volunteer: UserName;
};

@Injectable()
export class PlanningService {
  constructor(
    private readonly planning: Planning,
    private readonly breaks: BreakPeriods,
    private readonly volunteers: Volunteers,
    private readonly susbscription: SubscriptionService,
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

  async getPlanning(volunteerId: number): Promise<VolunteerWithTasks> {
    const [tasks, volunteer] = await Promise.all([
      this.planning.generateForVolunteer(volunteerId),
      this.volunteers.find(volunteerId),
    ]);
    return { tasks, volunteer };
  }

  getMobilizationsHeIsPartOf(volunteerId: number): Promise<PlanningTask[]> {
    return this.planning.listVolunteerTasks(volunteerId);
  }

  subscribe(volunteerId: number) {
    return this.susbscription.subscribe(volunteerId);
  }
}
