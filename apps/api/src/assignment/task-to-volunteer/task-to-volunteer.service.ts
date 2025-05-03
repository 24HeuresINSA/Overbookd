import { Injectable } from "@nestjs/common";
import {
  AssignmentIdentifier,
  AssignTaskToVolunteer,
  TaskForAssignment,
  TaskIdentifier,
} from "@overbookd/assignment";

@Injectable()
export class TaskToVolunteerService {
  constructor(private readonly assign: AssignTaskToVolunteer) {}

  async findAssignableTasks(): Promise<TaskForAssignment[]> {
    return this.assign.assignableTasks();
  }

  async findAllTasks(): Promise<TaskForAssignment[]> {
    return this.assign.allTasksForAssignment();
  }

  async selectTask(taskId: TaskIdentifier["id"]) {
    return this.assign.selectTask(taskId);
  }

  async selectAssignment(assignmentIdentifier: AssignmentIdentifier) {
    return this.assign.selectAssignment(assignmentIdentifier);
  }
}
