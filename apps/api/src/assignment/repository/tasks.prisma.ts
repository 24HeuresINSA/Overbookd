import { PrismaService } from "../../prisma.service";
import { Tasks } from "../task.service";
import { TaskWithRequestedTeams } from "@overbookd/assignment";
import {
  DatabaseTaskWithRequestedTeams,
  HAS_TEAM_REQUESTS,
  IS_READY_AND_EXISTS,
  SELECT_TASK_WITH_TEAMS,
} from "./task.query";

export class PrismaTasks implements Tasks {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskWithRequestedTeams[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: {
        ...IS_READY_AND_EXISTS,
        ...HAS_TEAM_REQUESTS,
      },
      select: SELECT_TASK_WITH_TEAMS,
    });
    return tasks.map(toTaskWithRequestedTeams);
  }
}

export function toTaskWithRequestedTeams(
  task: DatabaseTaskWithRequestedTeams,
): TaskWithRequestedTeams {
  const teams = [
    ...new Set(
      task.mobilizations.flatMap((m) => m.teams.map((t) => t.teamCode)),
    ),
  ];
  return {
    id: task.id,
    name: task.name,
    topPriority: task.topPriority,
    category: task.category,
    teams,
  };
}
