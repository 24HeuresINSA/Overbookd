import {
  AskForReviewTasks,
  DraftWithoutConflicts,
  FestivalTaskError,
  FestivalTaskInReview,
  isInReview,
  isRefused,
  RefusedWithoutConflicts,
} from "@overbookd/festival-event";
import {
  DraftBuilder,
  FestivalTaskBuilder,
  ReviewableBuilder,
} from "./festival-task.builder";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import { PrismaService } from "../../../../prisma.service";
import { DRAFT } from "@overbookd/festival-event-constants";

export class PrismaAskForReview implements AskForReviewTasks {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: number,
  ): Promise<DraftWithoutConflicts | RefusedWithoutConflicts | null> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    if (task.status === DRAFT) {
      return DraftBuilder.fromDatabase(task).festivalTask;
    }
    const inReview = ReviewableBuilder.fromDatabase(task).festivalTask;
    return isRefused(inReview) ? inReview : null;
  }

  async save(task: FestivalTaskInReview): Promise<FestivalTaskInReview> {
    const updated = await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(task.id),
      select: SELECT_FESTIVAL_TASK,
      data: FestivalTaskQueryBuilder.askForReview(task),
    });
    const { festivalTask } = FestivalTaskBuilder.fromDatabase(updated);
    if (!isInReview(festivalTask)) {
      throw new FestivalTaskError("La FT n'est pas encore en relecture");
    }
    return festivalTask;
  }
}
