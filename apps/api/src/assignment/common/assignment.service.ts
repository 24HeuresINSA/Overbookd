import { Injectable } from "@nestjs/common";
import {
  Assignment,
  AssignmentIdentifier,
  Assignments,
  Planning,
  PlanningEvent,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import {
  VolunteerWithAssignmentStats,
  TaskForCalendar,
  AssignmentStats,
} from "@overbookd/http";

export type AssignmentRepository = Assignments & {
  findOneForCalendar(
    identifier: AssignmentIdentifier,
    volunteerId: number,
  ): Promise<TaskForCalendar>;
  findOne<T extends boolean>(
    identifier: AssignmentIdentifier,
    withDetails: T,
  ): Promise<Assignment<{ withDetails: T }>>;
};

export type AssignmentStatsRepository = {
  getForAll(): Promise<VolunteerWithAssignmentStats[]>;
  getForOne(volunteerId: number): Promise<AssignmentStats>;
};

@Injectable()
export class AssignmentService {
  constructor(
    private readonly assignments: AssignmentRepository,
    private readonly stats: AssignmentStatsRepository,
    private readonly planning: Planning,
  ) {}

  async findOneForCalendar(
    identifier: AssignmentIdentifier,
    volunteerId: number,
  ): Promise<TaskForCalendar> {
    return this.assignments.findOneForCalendar(identifier, volunteerId);
  }

  async findOne<T extends boolean>(
    identifier: AssignmentIdentifier,
    withDetails: T,
  ): Promise<Assignment<{ withDetails: T }>> {
    return this.assignments.findOne<T>(identifier, withDetails);
  }

  async getPlanning(volunteerId: number): Promise<PlanningEvent[]> {
    return this.planning.for(volunteerId);
  }

  async assign(
    volunteersForAssignment: VolunteersForAssignment,
  ): Promise<Assignment> {
    return this.assignments.assign(volunteersForAssignment);
  }

  async unassign(
    assignment: AssignmentIdentifier,
    assigneeId: number,
  ): Promise<void> {
    return this.assignments.unassign(assignment, assigneeId);
  }

  async getAllVolunteersStats(): Promise<VolunteerWithAssignmentStats[]> {
    return this.stats.getForAll();
  }

  async getOneVolunteerStats(volunteerId: number): Promise<AssignmentStats> {
    return this.stats.getForOne(volunteerId);
  }
}
