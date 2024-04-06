import { Injectable } from "@nestjs/common";
import { Categorize } from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/period";

type RequestedTeam = {
  code: string;
  count: number;
  assignmentCount: number;
};

type AssignmentPeriod = IProvidePeriod & {
  id: string;
  teams: RequestedTeam[];
};

export type TaskWithPeriods = Categorize & {
  id: number;
  name: string;
  periods: AssignmentPeriod[];
};

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
