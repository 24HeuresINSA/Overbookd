import { Injectable } from "@nestjs/common";
import {
  MissingAssignmentTask,
  MissingAssignmentTasks,
} from "@overbookd/assignment";

@Injectable()
export class TaskService {
  constructor(private readonly tasks: MissingAssignmentTasks) {}

  async findAll(): Promise<MissingAssignmentTask[]> {
    return this.tasks.list();
  }
}
