import { PrismaService } from "../../../../prisma.service";
import { FestivalActivities } from "../festival-task-common.model";
import { FestivalActivityBuilder } from "./festival-activity.builder";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity.query";

export class PrismaFestivalActivities implements FestivalActivities {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: number) {
    const activity = await this.prisma.festivalActivity.findFirst({
      where: { id },
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    return FestivalActivityBuilder.fromDatabase(activity);
  }
}
