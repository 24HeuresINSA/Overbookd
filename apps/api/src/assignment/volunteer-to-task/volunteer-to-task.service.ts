import { Injectable } from "@nestjs/common";
import {
  AssignVolunteerToTask,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";

@Injectable()
export class VolunteerToTaskService {
  constructor(private readonly assign: AssignVolunteerToTask) {}

  async findVolunteers(): Promise<VolunteerWithAssignmentDuration[]> {
    return this.assign.volunteers();
  }
}
