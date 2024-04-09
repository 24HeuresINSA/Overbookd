import { Injectable } from "@nestjs/common";
import { TaskWithUnassignedTeams } from "@overbookd/assignment";

export type Tasks = {
  findAll(): Promise<TaskWithUnassignedTeams[]>;
};

@Injectable()
export class TaskService {
  constructor(private readonly tasks: Tasks) {}

  async findAll(): Promise<TaskWithUnassignedTeams[]> {
    return this.tasks.findAll();
  }
}
