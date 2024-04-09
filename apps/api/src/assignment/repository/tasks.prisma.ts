import { PrismaService } from "../../prisma.service";
import { Tasks } from "../task.service";
import {
  DeductUnassignedTeams,
  TaskWithUnassignedTeams,
} from "@overbookd/assignment";
import {
  DatabaseTaskWithUnassignedTeams,
  HAS_TEAM_REQUESTS,
  IS_READY_AND_EXISTS,
  SELECT_TASK_WITH_TEAMS,
} from "./task.query";

export class PrismaTasks implements Tasks {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskWithUnassignedTeams[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: {
        ...IS_READY_AND_EXISTS,
        ...HAS_TEAM_REQUESTS,
      },
      select: SELECT_TASK_WITH_TEAMS,
    });
    return tasks.map(toTaskWithUnassignedTeams);
  }
}

function toTaskWithUnassignedTeams(
  task: DatabaseTaskWithUnassignedTeams,
): TaskWithUnassignedTeams {
  const taskForTeams = {
    assignments: task.mobilizations.map((m) => ({
      assignees: m.assignees.map((a) => ({ as: a.teamCode })),
      requestedTeams: m.teams.map((t) => ({
        count: t.count,
        code: t.teamCode,
      })),
    })),
  };
  const teams = DeductUnassignedTeams.fromTask(taskForTeams);
  return {
    id: task.id,
    name: task.name,
    topPriority: task.topPriority,
    category: task.category,
    teams,
  };
}
