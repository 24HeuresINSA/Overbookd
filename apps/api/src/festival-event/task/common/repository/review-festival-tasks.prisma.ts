import {
  FestivalTask,
  FestivalTasksForReview,
  isDraft,
} from "@overbookd/festival-event";
import { ReviewableWithoutConflicts } from "@overbookd/festival-event/src/festival-task/volunteer-conflicts";
import { PrismaService } from "../../../../prisma.service";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import {
  FestivalTaskBuilder,
  ReviewableBuilder,
} from "./festival-task.builder";

export class PrismaFestivalTasksForReview implements FestivalTasksForReview {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: FestivalTask["id"],
  ): Promise<ReviewableWithoutConflicts | null> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    const withConflicts = FestivalTaskBuilder.fromDatabase(task).festivalTask;
    if (isDraft(withConflicts)) return null;
    return withConflicts;
  }

  async save<T extends ReviewableWithoutConflicts>(task: T): Promise<T> {
    const updated = await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(task.id),
      select: SELECT_FESTIVAL_TASK,
      data: FestivalTaskQueryBuilder.update(task),
    });
    return ReviewableBuilder.fromDatabase(updated).festivalTask as T;
  }
}
