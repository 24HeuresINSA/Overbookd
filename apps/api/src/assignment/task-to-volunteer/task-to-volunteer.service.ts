import { Injectable } from "@nestjs/common";
import {
  AssignmentIdentifier,
  AssignmentVolunteer,
  AssignTaskToVolunteer,
  Friends,
  MissingAssignmentTask,
  TaskIdentifier,
} from "@overbookd/assignment";
import { IProvidePeriod } from "@overbookd/period";

@Injectable()
export class TaskToVolunteerService {
  constructor(
    private readonly assign: AssignTaskToVolunteer,
    private readonly friends: Friends,
  ) {}

  async findTasks(all: boolean): Promise<MissingAssignmentTask[]> {
    return this.assign.tasks(all);
  }

  async selectTask(taskId: TaskIdentifier["id"]) {
    return this.assign.selectTask(taskId);
  }

  async selectAssignment(assignmentIdentifier: AssignmentIdentifier) {
    return this.assign.selectAssignment(assignmentIdentifier);
  }

  async getAvailableFriends(
    volunteerId: AssignmentVolunteer["id"],
    during: IProvidePeriod,
  ) {
    return this.friends.availableDuringWith(during, volunteerId);
  }
}
