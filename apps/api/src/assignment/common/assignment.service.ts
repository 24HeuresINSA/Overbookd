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
  findOne(identifier: AssignmentIdentifier): Promise<Assignment>;
};

@Injectable()
export class AssignmentService {
  constructor(
    private readonly assignments: AssignmentRepository,
    private readonly planning: Planning,
  ) {}

  async findOne(identifier: AssignmentIdentifier): Promise<Assignment> {
    return this.assignments.findOne(identifier);
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
