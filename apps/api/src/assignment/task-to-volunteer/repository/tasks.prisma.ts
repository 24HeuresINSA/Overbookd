import { TaskWithAssignments, Tasks } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import {
  DatabaseTaskWithAssignments,
  IS_READY_AND_EXISTS,
  SELECT_TASK_WITH_ASSIGNMENTS,
} from "./task.query";

export class PrismaTasks implements Tasks {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskWithAssignments[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: IS_READY_AND_EXISTS,
      select: SELECT_TASK_WITH_ASSIGNMENTS,
    });
    return tasks.map(toTaskWithAssignments);
  }
}

function toTaskWithAssignments(
  task: DatabaseTaskWithAssignments,
): TaskWithAssignments {
  const assignments = task.mobilizations.map((m) => ({
    assignees: m.assignees.map((a) => ({ as: a.teamCode })),
    requestedTeams: m.teams.map((t) => ({
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
