import {
  FestivalActivity,
  Reviewable,
  ReviewingFestivalActivities,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";
import { FestivalActivityBuilder } from "./festival-activity.builder";
import { FestivalActivityQueryBuilder } from "./festival-activity.query";

export class PrismaReviewingFestivalActivities
  implements ReviewingFestivalActivities
{
  constructor(private prisma: PrismaService) {}

  async findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    const activity = await this.prisma.festivalActivity.findUnique({
      where: { id },
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    if (!activity) return null;
    return FestivalActivityBuilder.fromDatabase(activity).festivalActivity;
  }

  async save<T extends Reviewable>(activity: T): Promise<T> {
    const updated = await this.prisma.festivalActivity.update({
      where: { id: activity.id },
      select: SELECT_FESTIVAL_ACTIVITY,
      data: FestivalActivityQueryBuilder.update(activity),
    });
    return FestivalActivityBuilder.fromDatabase(updated).festivalActivity as T;
  }
}
