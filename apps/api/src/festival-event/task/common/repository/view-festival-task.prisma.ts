import {
  FestivalTaskWithoutConflicts,
  FestivalTasksForView,
  PreviewFestivalTask,
} from "@overbookd/festival-event";
import {
  IS_NOT_DELETED,
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import { PrismaService } from "../../../../prisma.service";
import { FestivalTaskBuilder } from "./festival-task.builder";

export class PrismaViewFestivalTasks implements FestivalTasksForView {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<PreviewFestivalTask[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: IS_NOT_DELETED,
      select: SELECT_FESTIVAL_TASK,
      orderBy: { id: "asc" },
    });
    return tasks.map((task) => FestivalTaskBuilder.fromDatabase(task).preview);
  }

  async one(id: number): Promise<FestivalTaskWithoutConflicts> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    return FestivalTaskBuilder.fromDatabase(task).festivalTask;
  }
}
