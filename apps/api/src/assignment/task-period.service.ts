import { Injectable } from "@nestjs/common";
import { TaskWithPeriods } from "@overbookd/assignment";

export type TaskPeriods = {
  findAll(): Promise<TaskWithPeriods[]>;
};

@Injectable()
export class TaskPeriodService {
  constructor(private readonly taskPeriods: TaskPeriods) {}

  async findAll(): Promise<TaskWithPeriods[]> {
    return this.taskPeriods.findAll();
  }
}
