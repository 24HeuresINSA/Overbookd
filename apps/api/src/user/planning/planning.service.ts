import { Injectable } from "@nestjs/common";
import { PlanningTask, VolunteerForPlanning } from "@overbookd/http";
import { Period } from "@overbookd/time";
import { BreakDefinition, BreakPeriods } from "@overbookd/planning";
import { Planning } from "./domain/planning";
import { SubscriptionService } from "./subscription.service";
import { PlanningRenderStrategy } from "./render/render-strategy";
import { VolunteerWithTeams } from "./domain/task.model";

export type Volunteers = {
  all(): Promise<VolunteerForPlanning[]>;
  find(volunteerId: number): Promise<VolunteerWithTeams | null>;
};

type UseCases = {
  planning: Readonly<Planning>;
  breaks: Readonly<BreakPeriods>;
  renderStrategy: Readonly<PlanningRenderStrategy>;
};

type Repositories = {
  volunteers: Readonly<Volunteers>;
};

@Injectable()
export class PlanningService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
    private readonly susbscription: SubscriptionService,
  ) {}

  async getBreakPeriods(volunteer: number) {
    return this.useCases.breaks.of(volunteer);
  }

  async addBreakPeriod(breakDefinition: BreakDefinition) {
    return this.useCases.breaks.for(breakDefinition);
  }

  removeBreakPeriod(volunteer: number, period: Period) {
    return this.useCases.breaks.remove({ volunteer, period });
  }

  getVolunteers() {
    return this.repositories.volunteers.all();
  }

  async buildOne(format: string, volunteerId: number) {
    const tasks =
      await this.useCases.planning.generateForVolunteer(volunteerId);
    const renderStrategy = this.useCases.renderStrategy.get(format);
    return renderStrategy.render(tasks, volunteerId);
  }

  getMobilizationsHeIsPartOf(volunteerId: number): Promise<PlanningTask[]> {
    return this.useCases.planning.listVolunteerTasks(volunteerId);
  }

  subscribe(volunteerId: number) {
    return this.susbscription.subscribe(volunteerId);
  }
}
