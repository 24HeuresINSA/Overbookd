import {
  CreateFestivalActivityRepository,
  Draft,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";
import { DraftBuilder } from "./festival-activity.builder";

type DatabaseFeedback = {
  authorId: number;
  content: string;
  publishedAt: Date;
};

export class PrismaCreateFestivalActivities
  implements CreateFestivalActivityRepository
{
  constructor(private readonly prisma: PrismaService) {}
  async create(activity: Draft): Promise<Draft> {
    const saved = await this.prisma.festivalActivity.create({
      select: SELECT_FESTIVAL_ACTIVITY,
      data: {
        id: activity.id,
        status: activity.status,
        name: activity.general.name,
        description: activity.general.description,
        toPublish: activity.general.toPublish,
        photoLink: activity.general.photoLink,
        isFlagship: activity.general.isFlagship,
        categories: activity.general.categories,
        generalTimeWindows: {
          create: activity.general.timeWindows,
        },
        teamCode: activity.inCharge.team,
        adherentId: activity.inCharge.adherent.id,
        contractors: {
          create: activity.inCharge.contractors,
        },
        locationId: activity.signa.location?.id,
        signages: {
          create: activity.signa.signages,
        },
        specialNeed: activity.security.specialNeed,
        water: activity.supply.water,
        electricity: {
          create: activity.supply.electricity,
        },
        inquiryTimeWindows: {
          create: activity.inquiry.timeWindows,
        },
        inquiries: {
          create: [
            ...activity.inquiry.barriers,
            ...activity.inquiry.electricity,
            ...activity.inquiry.gears,
          ],
        },
        feedbacks: {
          create: this.formatFeedbacks(activity.feedbacks),
        },
      },
    });
    return DraftBuilder.fromDatabase(saved).festivalActivity;
  }

  private formatFeedbacks(feedbacks: Draft["feedbacks"]): DatabaseFeedback[] {
    return feedbacks.map((feedback) => ({
      authorId: feedback.author.id,
      content: feedback.content,
      publishedAt: feedback.publishedAt,
    }));
  }
}
