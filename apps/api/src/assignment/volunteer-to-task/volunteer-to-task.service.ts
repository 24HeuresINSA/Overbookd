import { Injectable } from "@nestjs/common";
import {
  AssignVolunteerToTask,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import { AssignmentSummaryWithTask } from "@overbookd/http";

export type AvailableAssignments = {
  findAssignableFor(volunteerId: number): Promise<AssignmentSummaryWithTask[]>;
};

@Injectable()
export class VolunteerToTaskService {
  constructor(
    private readonly assign: AssignVolunteerToTask,
    private readonly assignments: AvailableAssignments,
  ) {}

  async findVolunteers(): Promise<VolunteerWithAssignmentDuration[]> {
    return this.assign.volunteers();
  }

  async findAssignmentsFor(
    volunteerId: number,
  ): Promise<AssignmentSummaryWithTask[]> {
    return this.assignments.findAssignableFor(volunteerId);
  }
}
