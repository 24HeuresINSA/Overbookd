import { AssignedTasks, AssignmentTask } from "@overbookd/assignment";
import { PrismaService } from "../../prisma.service";
import {
  DatabaseAssignmentTask,
  IS_READY_AND_EXISTS,
  SELECT_ASSIGNMENT_TASK,
} from "./assigned-task.query";

export class PrismaAssignedTasks implements AssignedTasks {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AssignmentTask[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: IS_READY_AND_EXISTS,
      select: SELECT_ASSIGNMENT_TASK,
    });
    return tasks.map(toAssignmentTask);
  }
}

function toAssignmentTask(task: DatabaseAssignmentTask): AssignmentTask {
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
