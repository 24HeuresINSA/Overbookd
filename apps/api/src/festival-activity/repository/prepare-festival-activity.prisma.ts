import {
  FestivalActivity,
  PrepareFestivalActivityRepository,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";
import {
  FestivalActivityBuilder,
  DatabaseFestivalActivity,
} from "./festival-activity.builder";

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

  async findById(id: FestivalActivity["id"]): Promise<FestivalActivity> {
    const activity = await this.prisma.festivalActivity.findUnique({
      where: { id },
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    return this.formatFestivalActivity(activity);
  }

  async save(activity: FestivalActivity): Promise<FestivalActivity> {
    // TODO: save activity in database
    return activity;
  }

  private formatFestivalActivity(
    activity: DatabaseFestivalActivity,
  ): FestivalActivity {
    return FestivalActivityBuilder.fromDatabase(activity).festivalActivity;
  }
}
