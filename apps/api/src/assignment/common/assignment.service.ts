import { Injectable } from "@nestjs/common";
import { Assignment, AssignmentIdentifier } from "@overbookd/assignment";

export type Assignments = {
  findOne(identifier: AssignmentIdentifier): Promise<Assignment>;
};

@Injectable()
export class AssignmentService {
  constructor(private readonly assignments: Assignments) {}

  async findOne(identifier: AssignmentIdentifier): Promise<Assignment> {
    return this.assignments.findOne(identifier);
  }
}
