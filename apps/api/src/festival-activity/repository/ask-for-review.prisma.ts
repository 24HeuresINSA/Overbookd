import { PrismaService } from "../../prisma.service";
import {
  FestivalActivity,
  Reviewable,
  AskForReviewFestivalActivityRepository,
  isDraft,
  FestivalActivityError,
} from "@overbookd/festival-activity";
import { FestivalActivityBuilder } from "./festival-activity.builder";
import {
  FestivalActivityQueryBuilder,
  SELECT_FESTIVAL_ACTIVITY,
} from "./festival-activity.query";

export class PrismaAskForReview
  implements AskForReviewFestivalActivityRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<FestivalActivity> {
    const activity = await this.prisma.festivalActivity.findUnique({
      where: { id },
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    if (!activity) return null;
    return FestivalActivityBuilder.fromDatabase(activity).festivalActivity;
  }

  async save(activity: Reviewable): Promise<Reviewable> {
    const updated = await this.prisma.festivalActivity.update({
      where: { id: activity.id },
      select: SELECT_FESTIVAL_ACTIVITY,
      data: FestivalActivityQueryBuilder.askForReview(activity),
    });
    const { festivalActivity } = FestivalActivityBuilder.fromDatabase(updated);
    if (isDraft(festivalActivity)) {
      throw new FestivalActivityError("❌ La FA n'est pas encore en relecture");
    }
    return festivalActivity;
  }
}
