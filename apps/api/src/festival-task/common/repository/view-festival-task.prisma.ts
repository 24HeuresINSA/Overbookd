import {
  FestivalTask,
  FestivalTasksForView,
  PreviewFestivalTask,
} from "@overbookd/festival-event";
import {
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import { PrismaService } from "../../../prisma.service";
import { FestivalTaskBuilder } from "./festival-task.builder";

export class PrismaViewFestivalTasks implements FestivalTasksForView {
  constructor(private readonly prisma: PrismaService) {}

  all(): Promise<PreviewFestivalTask[]> {
    throw new Error("Method not implemented.");
  }

  async one(id: number): Promise<FestivalTask> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    return FestivalTaskBuilder.fromDatabase(task).festivalTask;
  }
}
