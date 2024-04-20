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

  async findTasks(): Promise<MissingAssignmentTask[]> {
    return this.assign.tasks();
  }

  async selectTask(taskId: TaskIdentifier["id"]) {
    return this.assign.selectTask(taskId);
  }

  async selectAssignment(
    taskId: TaskIdentifier["id"],
    assignmentIdentifier: AssignmentIdentifier,
  ) {
    return this.assign.selectAssignment(taskId, assignmentIdentifier);
  }
}
