import { Drive } from "@overbookd/festival-event";
import {
  PreviewForCommunication,
  PreviewForLogistic,
  PreviewForSecurity,
} from "@overbookd/http";
import { Previews } from "../festival-activity-common.model";
import { PrismaService } from "../../../prisma.service";
import {
  SHOULD_BE_IN_SECURITY_DASHBOARD,
  SELECT_PREVIEW_FOR_SECURITY_DASHBOARD,
  IS_PUBLIC,
  SELECT_PREVIEW_FOR_COMMUNICATION_DASHBOARD,
  SELECT_PREVIEW_FOR_LOGISTIC_DASHBOARD,
  SHOULD_BE_IN_LOGISTIC_DASHBOARD,
} from "./previews.query";

export class PrismaPreviews implements Previews {
  constructor(private readonly prisma: PrismaService) {}

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
      where: SHOULD_BE_IN_LOGISTIC_DASHBOARD,
      select: SELECT_PREVIEW_FOR_LOGISTIC_DASHBOARD,
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
}
