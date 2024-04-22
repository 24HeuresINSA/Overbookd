import { Injectable } from "@nestjs/common";
import {
  Assignment,
  AssignmentIdentifier,
  Assignments,
  Planning,
  PlanningEvent,
  VolunteersForAssignment,
} from "@overbookd/assignment";

export type AssignmentRepository = Assignments & {
  findOne<T extends boolean>(
    identifier: AssignmentIdentifier,
    withDetails: T,
  ): Promise<Assignment<{ withDetails: T }>>;
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

  async getPlanning(volunteerId: number): Promise<PlanningEvent[]> {
    return this.planning.for(volunteerId);
  }

  async assign(
    volunteersForAssignment: VolunteersForAssignment,
  ): Promise<Assignment> {
    return this.assignments.assign(volunteersForAssignment);
  }
}
