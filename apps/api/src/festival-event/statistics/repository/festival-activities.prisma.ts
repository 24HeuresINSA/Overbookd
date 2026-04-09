import { FestivalActivity } from "@overbookd/festival-event";
import { REFUSED } from "@overbookd/festival-event-constants";
import { Statistics } from "@overbookd/http";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { PrismaService } from "../../../prisma.service";
import { FestivalEventStatistics } from "../statistics.service";
import { FestivalEventStatisticsBuilder } from "./festival-event-statistics.builder";

const INIT_STATUS_STATISTICS: Statistics["status"] = {
  DRAFT: 0,
  IN_REVIEW: 0,
  VALIDATED: 0,
  REFUSED: 0,
};

export class PrismaFestivalActivityStatistics<
  T extends FestivalActivity = FestivalActivity,
> implements FestivalEventStatistics<T> {
  constructor(private readonly prisma: PrismaService) {}

  async byTeams(): Promise<Statistics<T>[]> {
    const statusStatistics = await this.prisma.festivalActivity.groupBy(
      FestivalEventStatisticsBuilder.groupByTeamAndStatus,
    );

    return FestivalEventStatisticsBuilder.generateStatistics(
      INIT_STATUS_STATISTICS,
      statusStatistics,
    );
  }

  countRefusalsByUser(adherentId: number): Promise<number> {
    return this.prisma.festivalActivity.count({
      where: {
        ...IS_NOT_DELETED,
        status: REFUSED,
        adherentId,
      },
    });
  }
}
