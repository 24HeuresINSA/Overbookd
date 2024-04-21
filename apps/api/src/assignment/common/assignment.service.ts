import { Injectable } from "@nestjs/common";
import {
  Assignment,
  AssignmentIdentifier,
  Planning,
  PlanningEvent,
} from "@overbookd/assignment";

export type Assignments = {
  findOne(identifier: AssignmentIdentifier): Promise<Assignment>;
};

@Injectable()
export class AssignmentService {
  constructor(
    private readonly assignments: Assignments,
    private readonly planning: Planning,
  ) {}

  async findOne(identifier: AssignmentIdentifier): Promise<Assignment> {
    return this.assignments.findOne(identifier);
  }

  async getPlanning(volunteerId: number): Promise<PlanningEvent[]> {
    return this.planning.for(volunteerId);
  }
}
