import {
  FestivalTask,
  FestivalTasksForPrepare,
  WithConflicts,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../prisma.service";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import { FestivalTaskBuilder } from "./festival-task.builder";

type TaskWithoutConflicts = Exclude<FestivalTask, WithConflicts>;

export class PrismaPrepareFestivalTasks implements FestivalTasksForPrepare {
  constructor(private prisma: PrismaService) {}

  async findById(id: FestivalTask["id"]): Promise<TaskWithoutConflicts | null> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    return FestivalTaskBuilder.fromDatabase(task).festivalTask;
  }

  async save(task: TaskWithoutConflicts): Promise<TaskWithoutConflicts> {
    const updated = await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(task.id),
      select: SELECT_FESTIVAL_TASK,
      data: FestivalTaskQueryBuilder.update(task),
    });
    return FestivalTaskBuilder.fromDatabase(updated).festivalTask;
  }
}
