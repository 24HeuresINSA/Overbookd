import {
  CreateFestivalActivityRepository,
  Draft,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { DraftBuilder } from "./festival-activity.builder";
import {
  FestivalActivityQueryBuilder,
  SELECT_FESTIVAL_ACTIVITY,
} from "./festival-activity.query";

export class PrismaCreateFestivalActivities implements CreateFestivalActivityRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(activity: Draft): Promise<Draft> {
    const saved = await this.prisma.festivalActivity.create({
      select: SELECT_FESTIVAL_ACTIVITY,
      data: FestivalActivityQueryBuilder.create(activity),
    });
    return DraftBuilder.fromDatabase(saved).festivalActivity;
  }
}
