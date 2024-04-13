import { FullTask, Tasks } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import {
  DatabaseFullTask,
  IS_READY_AND_EXISTS,
  SELECT_TASK_WITH_ASSIGNMENTS,
} from "./task.query";

export class PrismaTasks implements Tasks {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FullTask[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: IS_READY_AND_EXISTS,
      select: SELECT_TASK_WITH_ASSIGNMENTS,
    });
    return tasks.map(toFullTask);
  }
}

function toFullTask(task: DatabaseFullTask): FullTask {
  const assignments = task.mobilizations.map((mobilization) => ({
    start: mobilization.start,
    end: mobilization.end,
    assignees: mobilization.assignees.map((a) => ({ as: a.teamCode })),
    requestedTeams: mobilization.teams.map((t) => ({
      count: t.count,
      code: t.teamCode,
    })),
  }));
  return {
    id: task.id,
    name: task.name,
    topPriority: task.topPriority,
    category: task.category,
    assignments,
  };
}
