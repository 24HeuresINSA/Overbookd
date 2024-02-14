import { FestivalEvent } from "@overbookd/festival-event";
import { Statistics } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";

const TEAM = "teamCode";
const STATUS = "status";
type TeamOrStatus = typeof TEAM | typeof STATUS;
type By = TeamOrStatus[];

const TEAM_AND_STATUS: By = [TEAM, STATUS];
const ORDER_BY_ASC_TEAM_CODE = { teamCode: "asc" } as const;
const COUNT_STATUS = { status: true } as const;
const GROUP_BY_TEAM_AND_STATUS = {
  by: TEAM_AND_STATUS,
  where: { isDeleted: false },
  _count: COUNT_STATUS,
  orderBy: ORDER_BY_ASC_TEAM_CODE,
};

type DatabaseStatusStatistics<T extends FestivalEvent> = {
  teamCode: string;
  _count: {
    status: number;
  };
  status: T["status"];
};

export class FestivalEventStatisticsBuilder {
  static get groupByTeamAndStatus() {
    return GROUP_BY_TEAM_AND_STATUS;
  }

  static generateStatistics<T extends FestivalEvent>(
    defaultStatus: Statistics<T>["status"],
    statusStatistics: DatabaseStatusStatistics<T>[],
  ) {
    return statusStatistics.reduce<Statistics<T>[]>(
      (acc, { teamCode, _count, status }) => {
        const teamIndex = acc.findIndex((stat) => stat.teamCode === teamCode);
        const previous = acc.at(teamIndex);

        if (teamIndex === -1 || !previous) {
          const initialisedStatus = this.init(
            defaultStatus,
            teamCode,
            _count.status,
            status,
          );
          return [...acc, initialisedStatus];
        }

        const merged = this.merge(previous, _count.status, status, teamCode);

        return updateItemToList(acc, teamIndex, merged);
      },
      [],
    );
  }

  private static init<T extends FestivalEvent>(
    defaultStatus: Statistics<T>["status"],
    teamCode: string,
    total: number,
    status: T["status"],
  ): Statistics<T> {
    const firstStatus = { ...defaultStatus, [status]: total };

    return { teamCode, total, status: firstStatus };
  }

  private static merge<T extends FestivalEvent>(
    previous: Statistics<T>,
    count: number,
    status: T["status"],
    teamCode: string,
  ): Statistics<T> {
    const total = previous.total + count;
    const mergedStatus = { ...previous.status, [status]: count };

    return { teamCode, total, status: mergedStatus };
  }
}
