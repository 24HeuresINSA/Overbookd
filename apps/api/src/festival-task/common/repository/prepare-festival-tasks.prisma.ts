import {
  FestivalTask,
  FestivalTasksForPrepare,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../prisma.service";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import { FestivalTaskBuilder } from "./festival-task.builder";

export class PrismaPrepareFestivalTasks implements FestivalTasksForPrepare {
  constructor(private prisma: PrismaService) {}

  async findById(
    id: FestivalTask["id"],
  ): Promise<FestivalTask<{ withConflicts: false }> | null> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    return FestivalTaskBuilder.fromDatabase(task).festivalTask;
  }

  async save(
    task: FestivalTask<{ withConflicts: false }>,
  ): Promise<FestivalTask<{ withConflicts: false }>> {
    const updated = await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(task.id),
      select: SELECT_FESTIVAL_TASK,
      data: FestivalTaskQueryBuilder.update(task),
    });
    return FestivalTaskBuilder.fromDatabase(updated).festivalTask;
  }
}
