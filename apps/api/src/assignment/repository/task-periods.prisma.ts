import { PrismaService } from "../../prisma.service";
import { TaskPeriods, TaskWithPeriods } from "../task-period.service";
import {
  DatabaseTaskWithPeriods,
  HAS_TEAM_REQUESTS,
  IS_READY_AND_EXISTS,
  SELECT_TASK_WITH_PERIODS,
} from "./task-period.query";

export class PrismaTaskPeriods implements TaskPeriods {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskWithPeriods[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: {
        ...IS_READY_AND_EXISTS,
        ...HAS_TEAM_REQUESTS,
      },
      select: SELECT_TASK_WITH_PERIODS,
    });
    return tasks.map(formatTaskWithPeriod);
  }
}

function formatTaskWithPeriod(task: DatabaseTaskWithPeriods): TaskWithPeriods {
  const periods = task.mobilizations.map((mobilization) => ({
    id: mobilization.id,
    teams: mobilization.teams.map((team) => ({
      code: team.teamCode,
      count: team.count,
      assignmentCount: mobilization._count.assignments,
    })),
    start: mobilization.assignments[0].start,
    end: mobilization.assignments[0].end,
  }));

  return {
    id: task.id,
    name: task.name,
    topPriority: task.topPriority,
    category: task.category,
    periods,
  };
}
