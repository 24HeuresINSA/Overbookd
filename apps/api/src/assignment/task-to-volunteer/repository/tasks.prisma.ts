import {
  Task,
  TaskIdentifier,
  TaskNotFoundError,
  Tasks,
} from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import {
  DatabaseTask,
  IS_READY_AND_EXISTS,
  SELECT_TASK_WITH_ASSIGNMENTS,
} from "./task.query";

export class PrismaTasks implements Tasks {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: {
        ...IS_READY_AND_EXISTS,
        ...this.buildHasAtLeatOneFuturePeriodCondition(),
      },
      select: SELECT_TASK_WITH_ASSIGNMENTS,
    });
    return tasks.map(toTask);
  }

  async findOne(id: TaskIdentifier["id"]): Promise<Task> {
    const task = await this.prisma.festivalTask.findFirst({
      where: { id, ...IS_READY_AND_EXISTS },
      select: SELECT_TASK_WITH_ASSIGNMENTS,
    });
    if (!task) throw new TaskNotFoundError(id);
    return toTask(task);
  }

  private buildHasAtLeatOneFuturePeriodCondition() {
    return { assignments: { some: { end: { gt: new Date() } } } };
  }
}

function toTask(task: DatabaseTask): Task {
  const assignments = task.mobilizations.flatMap((mobilization) => {
    const demands = mobilization.teams.map(({ teamCode, count }) => ({
      demand: count,
      team: teamCode,
    }));
    return mobilization.assignments.map((assignment) => {
      const identifier = {
        taskId: task.id,
        mobilizationId: mobilization.id,
        assignmentId: assignment.id,
      };
      const assignees = assignment.assignees.map(({ teamCode, userId }) => ({
        as: teamCode,
        id: userId,
      }));
      return {
        ...identifier,
        start: assignment.start,
        end: assignment.end,
        category: task.category,
        mobilizationId: mobilization.id,
        name: task.name,
        assignees,
        demands,
      };
    });
  });

  return {
    id: task.id,
    name: task.name,
    topPriority: task.topPriority,
    category: task.category,
    inChargeTeam: task.teamCode,
    assignments,
  };
}
