import { PreviewForSecu } from "@overbookd/http";
import { Previews } from "../festival-activity.service";
import { PrismaService } from "../../prisma.service";
import {
  SHOULD_BE_IN_SECURITY_DASHBOARD,
  SELECT_PREVIEW_FOR_SECURITY_DASHBOARD,
} from "./previews.query";

export class PrismaPreviews implements Previews {
  constructor(private readonly prisma: PrismaService) {}

  async forSecu(): Promise<PreviewForSecu[]> {
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
}
