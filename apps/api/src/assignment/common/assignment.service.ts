import { Injectable } from "@nestjs/common";
import {
  Assignment,
  AssignmentIdentifier,
  Assignments,
  Planning,
  PlanningEvent,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { VolunteerWithAssignmentStats, DisplayableAssignment } from "@overbookd/http";

export type AssignmentRepository = Assignments & {
  findOne<T extends boolean>(
    identifier: AssignmentIdentifier,
    withDetails: T,
  ): Promise<Assignment<{ withDetails: T }>>;
  findAllFor(volunteerId: number): Promise<DisplayableAssignment[]>;
  getVolunteersAssignmentStats(): Promise<VolunteerWithAssignmentStats[]>;
};

@Injectable()
export class AssignmentService {
  constructor(
    private readonly assignments: AssignmentRepository,
    private readonly planning: Planning,
  ) {}

  async findOne<T extends boolean>(
    identifier: AssignmentIdentifier,
    withDetails: T,
  ): Promise<Assignment<{ withDetails: T }>> {
    return this.assignments.findOne<T>(identifier, withDetails);
  }

  async findAllFor(volunteerId: number): Promise<DisplayableAssignment[]> {
    return this.assignments.findAllFor(volunteerId);
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

  async getVolunteersAssignmentStats(): Promise<VolunteerWithAssignmentStats[]> {
    return this.assignments.getVolunteersAssignmentStats();
  }
}
