import {
  FestivalActivity,
  PrepareFestivalActivityRepository,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";
import { FestivalActivityBuilder } from "./festival-activity.builder";

export class PrismaPrepareFestivalActivityRepository
  implements PrepareFestivalActivityRepository
{
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PreviewFestivalActivity[]> {
    const activities = await this.prisma.festivalActivity.findMany({
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    return activities.map(
      (activity) => FestivalActivityBuilder.fromDatabase(activity).preview,
    );
  }

  async findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    const activity = await this.prisma.festivalActivity.findUnique({
      where: { id },
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    if (!activity) return null;
    return FestivalActivityBuilder.fromDatabase(activity).festivalActivity;
  }

  async save(activity: FestivalActivity): Promise<FestivalActivity> {
    // TODO: save activity in database
    return activity;
  }
}
