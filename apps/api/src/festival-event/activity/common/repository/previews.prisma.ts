import { Drive, PreviewFestivalActivity } from "@overbookd/festival-event";
import { PreviewForCommunication, PreviewForSecurity } from "@overbookd/http";
import { Previews } from "../festival-activity-common.model";
import { PrismaService } from "../../../../prisma.service";
import {
  SHOULD_BE_IN_SECURITY_DASHBOARD,
  SELECT_PREVIEW_FOR_SECURITY_DASHBOARD,
  IS_PUBLIC,
  SELECT_PREVIEW_FOR_COMMUNICATION_DASHBOARD,
  SELECT_PREVIEW_FOR_LOGISTIC,
  SHOULD_BE_IN_LOGISTIC_PREVIEW,
  SELECT_PREVIEW_FOR_SIGNA,
  SHOULD_BE_IN_SIGNA_PREVIEW,
} from "./previews.query";
import { IS_NOT_DELETED } from "../../../../common/query/not-deleted.query";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";
import { FestivalActivityBuilder } from "./festival-activity.builder";
import { PreviewForLogistic } from "../../preview/logistic-preview";
import { PreviewForSigna } from "../../preview/signa-preview";

export class PrismaPreviews implements Previews {
  constructor(private readonly prisma: PrismaService) {}

  async byAdherentId(adherentId: number): Promise<PreviewFestivalActivity[]> {
    const activities = await this.prisma.festivalActivity.findMany({
      where: { ...IS_NOT_DELETED, adherentId },
      select: SELECT_FESTIVAL_ACTIVITY,
      orderBy: { id: "asc" },
    });
    return activities.map(
      (activity) => FestivalActivityBuilder.fromDatabase(activity).preview,
    );
  }

  async forSecurity(): Promise<PreviewForSecurity[]> {
    const fromDatabase = await this.prisma.festivalActivity.findMany({
      where: SHOULD_BE_IN_SECURITY_DASHBOARD,
      select: SELECT_PREVIEW_FOR_SECURITY_DASHBOARD,
    });

    return fromDatabase.map((activity) => ({
      id: activity.id,
      name: activity.name,
      team: activity.teamCode,
      timeWindows: activity.generalTimeWindows,
      specialNeeds: activity.specialNeed,
      freePass: activity.freePass,
    }));
  }

  async forCommunication(): Promise<PreviewForCommunication[]> {
    const fromDatabase = await this.prisma.festivalActivity.findMany({
      where: IS_PUBLIC,
      select: SELECT_PREVIEW_FOR_COMMUNICATION_DASHBOARD,
    });

    return fromDatabase.map((activity) => ({
      id: activity.id,
      status: activity.status,
      name: activity.name,
      timeWindows: activity.generalTimeWindows,
      description: activity.description,
      photoLink: activity.photoLink,
      isFlagship: activity.isFlagship,
      categories: activity.categories,
    }));
  }

  async forLogistic(): Promise<PreviewForLogistic[]> {
    const fromDatabase = await this.prisma.festivalActivity.findMany({
      where: SHOULD_BE_IN_LOGISTIC_PREVIEW,
      select: SELECT_PREVIEW_FOR_LOGISTIC,
    });

    return fromDatabase.map((activity) => ({
      id: activity.id,
      status: activity.status,
      name: activity.name,
      timeWindows: activity.inquiryTimeWindows,
      inquiries: activity.inquiries.map((inquiry) => ({
        slug: inquiry.catalogItem.slug,
        name: inquiry.catalogItem.name,
        quantity: inquiry.quantity,
        drive: inquiry.drive as Drive,
        gear: {
          id: inquiry.catalogItem.id,
          isConsumable: inquiry.catalogItem.isConsumable,
          isPonctualUsage: inquiry.catalogItem.isPonctualUsage,
          category: inquiry.catalogItem.category,
        },
      })),
    }));
  }

  async forSigna(): Promise<PreviewForSigna[]> {
    const fromDatabase = await this.prisma.festivalActivity.findMany({
      where: SHOULD_BE_IN_SIGNA_PREVIEW,
      select: SELECT_PREVIEW_FOR_SIGNA,
    });

    return fromDatabase.map((activity) => ({
      id: activity.id,
      name: activity.name,
      team: activity.team?.name ?? "",
      locationName: activity.location?.name ?? "",
      signages: activity.signages.map((signage) => ({
        ...signage,
        catalogName: signage.catalogItem?.name ?? "",
      })),
    }));
  }
}
