import { Injectable } from "@nestjs/common";
import {
  AssignTaskToVolunteer,
  MissingAssignmentTask,
} from "@overbookd/assignment";

@Injectable()
export class TaskToVolunteerService {
  constructor(private readonly assign: AssignTaskToVolunteer) {}

  async findTasks(): Promise<MissingAssignmentTask[]> {
    return this.assign.tasks();
  }
}