import {
  AskForReviewTasks,
  DraftWithoutConflicts,
  FestivalTaskError,
  FestivalTaskInReview,
  isFestivalTaskDraft,
} from "@overbookd/festival-event";
import { DraftBuilder, FestivalTaskBuilder } from "./festival-task.builder";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import { PrismaService } from "../../../prisma.service";

export class PrismaAskForReview implements AskForReviewTasks {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<DraftWithoutConflicts> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    return DraftBuilder.fromDatabase(task).festivalTask;
  }

  async save(task: FestivalTaskInReview): Promise<FestivalTaskInReview> {
    const updated = await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(task.id),
      select: SELECT_FESTIVAL_TASK,
      data: FestivalTaskQueryBuilder.askForReview(task),
    });
    const { festivalTask } = FestivalTaskBuilder.fromDatabase(updated);
    if (isFestivalTaskDraft(festivalTask)) {
      throw new FestivalTaskError("❌ La FT n'est pas encore en relecture");
    }
    return festivalTask;
  }
}
