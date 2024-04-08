import { Injectable } from "@nestjs/common";
import { TaskWithRequestedTeams } from "@overbookd/assignment";

export type Tasks = {
  findAll(): Promise<TaskWithRequestedTeams[]>;
};

@Injectable()
export class TaskService {
  constructor(private readonly tasks: Tasks) {}

  async findAll(): Promise<TaskWithRequestedTeams[]> {
    return this.tasks.findAll();
  }
}
