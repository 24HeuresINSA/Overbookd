import {
  FestivalActivity,
  PrepareFestivalActivityRepository,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import {
  SELECT_FESTIVAL_ACTIVITY,
  SELECT_PREVIEW_FESTIVAL_ACTIVITY,
} from "../festival-activity.query";
import {
  DatabasePreview,
  formatReviews,
  isDraft,
  formatFestivalActivity,
} from "../festival-activity.formatter";

export class PrismaPrepareFestivalActivityRepository
  implements PrepareFestivalActivityRepository
{
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PreviewFestivalActivity[]> {
    const activities = await this.prisma.festivalActivity.findMany({
      select: SELECT_PREVIEW_FESTIVAL_ACTIVITY,
    });
    return activities.map(this.formatPreviewFestivalActivity);
  }

  async findById(id: FestivalActivity["id"]): Promise<FestivalActivity> {
    const activity = await this.prisma.festivalActivity.findUnique({
      where: { id },
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    return formatFestivalActivity(activity);
  }

  async save(activity: FestivalActivity): Promise<FestivalActivity> {
    // TODO: save activity in database
    return activity;
  }

  private formatPreviewFestivalActivity(
    activity: DatabasePreview,
  ): PreviewFestivalActivity {
    const reviews = isDraft(activity) ? {} : formatReviews(activity.reviews);

    return {
      id: activity.id,
      status: activity.status,
      name: activity.name,
      team: activity.teamCode,
      adherent: activity.adherent,
      ...reviews,
    } as PreviewFestivalActivity;
  }
}
