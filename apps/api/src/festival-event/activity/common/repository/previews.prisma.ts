import { Drive, PreviewFestivalActivity } from "@overbookd/festival-event";
import {
  ActivityGearSearchOptions,
  PreviewForCommunication,
  PreviewForLogistic,
  PreviewForSecurity,
} from "@overbookd/http";
import { Previews } from "../festival-activity-common.model";
import { PrismaService } from "../../../../prisma.service";
import {
  SHOULD_BE_IN_SECURITY_DASHBOARD,
  SELECT_PREVIEW_FOR_SECURITY_DASHBOARD,
  IS_PUBLIC,
  SELECT_PREVIEW_FOR_COMMUNICATION_DASHBOARD,
  SELECT_PREVIEW_FOR_SIGNA,
  SHOULD_BE_IN_SIGNA_PREVIEW,
  SELECT_PREVIEW_FOR_LOGISTIC_DASHBOARD,
  DatabasePreviewForLogistic,
} from "./previews.query";
import { IS_NOT_DELETED } from "../../../../common/query/not-deleted.query";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";
import { FestivalActivityBuilder } from "./festival-activity.builder";
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

  async forLogistic(
    searchOptions: ActivityGearSearchOptions,
  ): Promise<PreviewForLogistic[]> {
    const slugSearch = searchOptions.search
      ? ({
          slug: { contains: searchOptions.search, mode: "insensitive" },
        } as const)
      : {};
    const categorySearch = searchOptions.category
      ? ({
          catalogItem: {
            category: {
              path: { contains: searchOptions.category, mode: "insensitive" },
            },
          },
        } as const)
      : {};
    const ownerSearch = searchOptions.owner
      ? ({
          catalogItem: {
            category: {
              ownerCode: { contains: searchOptions.owner, mode: "insensitive" },
            },
          },
        } as const)
      : {};
    const driveSearch = searchOptions.drive
      ? ({
          drive: { contains: searchOptions.drive, mode: "insensitive" },
        } as const)
      : {};

    const fromDatabase: DatabasePreviewForLogistic[] =
      await this.prisma.festivalActivity.findMany({
        where: {
          ...IS_NOT_DELETED,
          inquiries: {
            some: {
              ...slugSearch,
              ...categorySearch,
              ...ownerSearch,
              ...driveSearch,
            },
          },
        },
        select: SELECT_PREVIEW_FOR_LOGISTIC_DASHBOARD,
      });

    return fromDatabase.map((activity) => ({
      id: activity.id,
      name: activity.name,
      status: activity.status,
      team: activity.teamCode,
      inquiries: activity.inquiries.map((inquiry) => {
        const drive = inquiry.drive ? (inquiry.drive as Drive) : undefined;
        return {
          drive,
          quantity: inquiry.quantity,
          isPonctualUsage: inquiry.catalogItem.isPonctualUsage,
          isConsumable: inquiry.catalogItem.isConsumable,
          slug: inquiry.catalogItem.slug,
          name: inquiry.catalogItem.name,
          owner: inquiry.catalogItem.category?.owner?.name,
          category: inquiry.catalogItem.category?.name,
        };
      }),
    }));
  }

  async forSecurity(): Promise<PreviewForSecurity[]> {
    const fromDatabase = await this.prisma.festivalActivity.findMany({
      where: SHOULD_BE_IN_SECURITY_DASHBOARD,
      select: SELECT_PREVIEW_FOR_SECURITY_DASHBOARD,
    });

    return fromDatabase.map((activity) => ({
      id: activity.id,
      name: activity.name,
      status: activity.status,
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

  async forSigna(): Promise<PreviewForSigna[]> {
    const fromDatabase = await this.prisma.festivalActivity.findMany({
      where: SHOULD_BE_IN_SIGNA_PREVIEW,
      select: SELECT_PREVIEW_FOR_SIGNA,
    });

    return fromDatabase.map((activity) => ({
      id: activity.id,
      name: activity.name,
      status: activity.status,
      team: activity.team?.name ?? "",
      locationName: activity.location?.name ?? "",
      signages: activity.signages.map((signage) => ({
        ...signage,
        catalogName: signage.catalogItem?.name ?? "",
      })),
    }));
  }
}
