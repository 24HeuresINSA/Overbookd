import { Injectable } from "@nestjs/common";
import {
  MultiPlanningVolunteer,
  PlanningTask,
  VolunteerForPlanningLeaflet,
} from "@overbookd/http";
import { IProvidePeriod, Period } from "@overbookd/time";
import {
  AssignmentEvent,
  BreakDefinition,
  BreakPeriods,
} from "@overbookd/assignment";
import { Planning } from "./domain/planning";
import { SubscriptionService } from "./subscription.service";
import { PlanningRenderStrategy } from "./render/render-strategy";
import { UserWithTeams } from "@overbookd/user";

export type PlanningVolunteers = {
  allForLeaflets(): Promise<VolunteerForPlanningLeaflet[]>;
  findOne(volunteerId: number): Promise<UserWithTeams | null>;
  assignmentsFor(volunteerId: number): Promise<AssignmentEvent[]>;
  availabilitiesFor(volunteerId: number): Promise<IProvidePeriod[]>;
};

type UseCases = {
  planning: Readonly<Planning>;
  breaks: Readonly<BreakPeriods>;
  renderStrategy: Readonly<PlanningRenderStrategy>;
};

type Repositories = {
  volunteers: Readonly<PlanningVolunteers>;
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

  getVolunteersForLeaflets() {
    return this.repositories.volunteers.allForLeaflets();
  }

  async buildOne(format: string, volunteerId: number, plainText = false) {
    const tasks =
      await this.useCases.planning.generateForVolunteer(volunteerId);
    const renderStrategy = this.useCases.renderStrategy.get(format, plainText);
    return renderStrategy.render(tasks, volunteerId);
  }

  getMobilizationsHeIsPartOf(volunteerId: number): Promise<PlanningTask[]> {
    return this.useCases.planning.listVolunteerTasks(volunteerId);
  }

  subscribe(volunteerId: number) {
    return this.susbscription.subscribe(volunteerId);
  }

  async getVolunteersForMultiPlanning(
    volunteerIds: number[],
    withBreakPeriods: boolean = false,
  ): Promise<MultiPlanningVolunteer[]> {
    const volunteers = await Promise.all(
      volunteerIds.map(async (id) => {
        const volunteer = await this.repositories.volunteers.findOne(id);
        if (!volunteer) return null;
        const tasks = await this.getMobilizationsHeIsPartOf(id);
        const assignments =
          await this.repositories.volunteers.assignmentsFor(id);
        const availabilities =
          await this.repositories.volunteers.availabilitiesFor(id);
        const breaks = withBreakPeriods
          ? await this.getBreakPeriods(id)
          : undefined;
        return {
          ...volunteer,
          tasks,
          assignments,
          availabilities,
          breaks,
        };
      }),
    );
    return volunteers.filter((v) => v !== null);
  }
}
