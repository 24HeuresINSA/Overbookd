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
      where: IS_READY_AND_EXISTS,
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
}

function toTask(task: DatabaseTask): Task {
  const assignments = task.mobilizations.flatMap((mobilization) => {
    const assignees = mobilization.assignees.map(({ teamCode }) => ({
      as: teamCode,
    }));
    const requestedTeams = mobilization.teams.map(({ teamCode, count }) => ({
      demands: count,
      code: teamCode,
    }));
    return mobilization.assignments.map((assignment) => {
      const identifier = {
        mobilizationId: mobilization.id,
        assignmentId: assignment.id,
      };
      return {
        identifier,
        start: assignment.start,
        end: assignment.end,
        category: task.category,
        mobilizationId: mobilization.id,
        assignees,
        requestedTeams,
      };
    });
  });

  return {
    id: task.id,
    name: task.name,
    topPriority: task.topPriority,
    category: task.category,
    assignments,
  };
}
