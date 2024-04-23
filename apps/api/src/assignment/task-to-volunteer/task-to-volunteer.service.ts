import { Injectable } from "@nestjs/common";
import {
  AssignmentIdentifier,
  AssignTaskToVolunteer,
  MissingAssignmentTask,
  TaskIdentifier,
} from "@overbookd/assignment";

@Injectable()
export class TaskToVolunteerService {
  constructor(private readonly assign: AssignTaskToVolunteer) {}

  async findTasks(all: boolean): Promise<MissingAssignmentTask[]> {
    return this.assign.tasks(all);
  }

  async selectTask(taskId: TaskIdentifier["id"]) {
    return this.assign.selectTask(taskId);
  }

  async selectAssignment(assignmentIdentifier: AssignmentIdentifier) {
    return this.assign.selectAssignment(assignmentIdentifier);
  }
}
