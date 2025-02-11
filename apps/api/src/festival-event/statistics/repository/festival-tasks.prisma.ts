import { FestivalTask } from "@overbookd/festival-event";
import { Statistics } from "@overbookd/http";
import { FestivalEventStatistics } from "../statistics.service";
import { PrismaService } from "../../../prisma.service";
import { FestivalEventStatisticsBuilder } from "./festival-event-statistics.builder";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";

const INIT_STATUS_STATISTICS: Statistics<FestivalTask>["status"] = {
  DRAFT: 0,
  IN_REVIEW: 0,
  REFUSED: 0,
  VALIDATED: 0,
  READY_TO_ASSIGN: 0,
};

export class PrismaFestivalTaskStatistics<T extends FestivalTask = FestivalTask>
  implements FestivalEventStatistics<T>
{
  constructor(private readonly prisma: PrismaService) {}

  async byTeams(): Promise<Statistics<T>[]> {
    const statusStatistics = await this.prisma.festivalTask.groupBy(
      FestivalEventStatisticsBuilder.groupByTeamAndStatus,
    );

    return FestivalEventStatisticsBuilder.generateStatistics(
      INIT_STATUS_STATISTICS,
      statusStatistics,
    );
  }

  countRefusalsByUser(administratorId: number): Promise<number> {
    return this.prisma.festivalTask.count({
      where: {
        ...IS_NOT_DELETED,
        administratorId,
        status: "REFUSED",
      },
    });
  }
}
