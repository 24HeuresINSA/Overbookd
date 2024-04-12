import { Injectable } from "@nestjs/common";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { IProvidePeriod, QUARTER_IN_MS } from "@overbookd/period";
import { BE_AFFECTED } from "@overbookd/permission";
import { PrismaService } from "../prisma.service";
import { VolunteerAvailability } from "@prisma/client";
import { getPeriodDuration } from "../utils/duration";

type OrgaNeedsRequest = {
  start: Date;
  end: Date;
  teams: string[];
};

export type OrgaNeedsResponse = {
  start: Date;
  end: Date;
  assignedVolunteers: number;
  availableVolunteers: number;
  requestedVolunteers: number;
};

const SELECT_REQUESTED_VOLUNTEERS = {
  start: true,
  end: true,
  teams: {
    select: {
      count: true,
    },
  },
  _count: {
    select: {
      volunteers: true,
    },
  },
};

const IS_NOT_DELETED = { isDeleted: false };
const SELECT_PERIOD = { start: true, end: true };

type RequestedVolunteersOverPeriod = IProvidePeriod & {
  requestedVolunteers: number;
};

type AssignmentsOverPeriod = IProvidePeriod;

type DataBaseOrgaStats = {
  interval: IProvidePeriod;
  assignments: AssignmentsOverPeriod[];
  availabilities: VolunteerAvailability[];
  requestedVolunteers: RequestedVolunteersOverPeriod[];
};

@Injectable()
export class OrgaNeedsService {
  constructor(private prisma: PrismaService) {}

  async computeOrgaStats(
    periodAndTeams: OrgaNeedsRequest,
  ): Promise<OrgaNeedsResponse[]> {
    const intervals = this.buildOrgaNeedsIntervals(periodAndTeams);

    const [assignments, availabilities, requestedVolunteers] =
      await Promise.all([
        this.getAssignments(periodAndTeams),
        this.getAvailabilities(periodAndTeams),
        this.getRequestedVolunteers(periodAndTeams),
      ]);

    return intervals.map((interval) =>
      this.formatIntervalStats({
        interval,
        assignments,
        availabilities,
        requestedVolunteers,
      }),
    );
  }

  private formatIntervalStats({
    interval,
    assignments,
    availabilities,
    requestedVolunteers,
  }: DataBaseOrgaStats) {
    const availableVolunteers = this.countAvailableVolunteersOnInterval(
      availabilities,
      interval,
    );

    const requestedVolunteersForInterval =
      this.countRequestedVolunteersOnInterval(requestedVolunteers, interval);

    const assignedVolunteers = this.countAssignedVolunteersOnInterval(
      assignments,
      interval,
    );

    return {
      ...interval,
      assignedVolunteers,
      availableVolunteers,
      requestedVolunteers: requestedVolunteersForInterval,
    };
  }

  private countAssignedVolunteersOnInterval(
    assignments: AssignmentsOverPeriod[],
    interval: IProvidePeriod,
  ) {
    return assignments.filter(includedPeriods(interval)).length;
  }

  private countRequestedVolunteersOnInterval(
    requestedVolunteers: RequestedVolunteersOverPeriod[],
    interval: IProvidePeriod,
  ) {
    return requestedVolunteers
      .filter(includedPeriods(interval))
      .reduce((acc, { requestedVolunteers }) => acc + requestedVolunteers, 0);
  }

  private countAvailableVolunteersOnInterval(
    availabilities: VolunteerAvailability[],
    interval: IProvidePeriod,
  ) {
    return availabilities.filter(includedPeriods(interval)).length;
  }

  private async getRequestedVolunteers(
    orgaNeedsRequest: OrgaNeedsRequest,
  ): Promise<RequestedVolunteersOverPeriod[]> {
    const timeWindows = await this.prisma.festivalTaskMobilization.findMany({
      where: {
        ft: IS_NOT_DELETED,
        ...this.periodIncludedCondition(orgaNeedsRequest),
        ...this.hasTeamCondition(orgaNeedsRequest.teams),
      },
      select: SELECT_REQUESTED_VOLUNTEERS,
    });

    return timeWindows.map(({ start, end, teams, _count }) => {
      const requestedVolunteers =
        teams.reduce((acc, { count }) => acc + count, 0) + _count.volunteers;

      return { start, end, requestedVolunteers };
    });
  }

  private async getAvailabilities(
    periodWithTeams: OrgaNeedsRequest,
  ): Promise<VolunteerAvailability[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: {
        ...this.periodIncludedCondition(periodWithTeams),
        ...this.notAssignedNorPartOfMibilizationDuring(periodWithTeams),
        user: {
          ...IS_NOT_DELETED,
          ...this.teamMemberCondition(periodWithTeams.teams),
        },
      },
    });
  }

  private notAssignedNorPartOfMibilizationDuring(period: IProvidePeriod) {
    return { NOT: { user: this.assignedOrPartOfMobilizationDuring(period) } };
  }

  private assignedOrPartOfMobilizationDuring(period: IProvidePeriod) {
    const isAssignedDuringPeriod = {
      assigned: {
        some: { assignment: this.periodIncludedCondition(period) },
      },
    };
    const isPartOfMobilizationDuringPeriod = {
      festivalTaskMobilizations: {
        some: { mobilization: this.periodIncludedCondition(period) },
      },
    };

    return {
      OR: [isAssignedDuringPeriod, isPartOfMobilizationDuringPeriod],
    };
  }

  private async getAssignments(
    orgaNeedsRequest: OrgaNeedsRequest,
  ): Promise<AssignmentsOverPeriod[]> {
    const assignedTasks = {
      assigned: {
        where: { assignment: this.periodIncludedCondition(orgaNeedsRequest) },
        select: { assignment: { select: SELECT_PERIOD } },
      },
    };

    const mobilizationsHeWillBePartOf = {
      festivalTaskMobilizations: {
        where: {
          mobilization: {
            ft: {
              status: { not: READY_TO_ASSIGN } as const,
              ...IS_NOT_DELETED,
            },
            ...this.periodIncludedCondition(orgaNeedsRequest),
          },
        },
        select: { mobilization: { select: SELECT_PERIOD } },
      },
    };

    const assignees = await this.prisma.user.findMany({
      where: {
        ...IS_NOT_DELETED,
        ...this.teamMemberCondition(orgaNeedsRequest.teams),
        ...this.assignedOrPartOfMobilizationDuring(orgaNeedsRequest),
      },
      select: { ...assignedTasks, ...mobilizationsHeWillBePartOf },
    });

    return assignees.flatMap(({ assigned, festivalTaskMobilizations }) => [
      ...assigned.map(({ assignment }) => assignment),
      ...festivalTaskMobilizations.map(({ mobilization }) => mobilization),
    ]);
  }

  private buildOrgaNeedsIntervals(period: IProvidePeriod): IProvidePeriod[] {
    const numberOfIntervals = Math.floor(
      getPeriodDuration(period) / QUARTER_IN_MS,
    );

    return Array.from({ length: numberOfIntervals }).map((_, index) => {
      const start = new Date(period.start.getTime() + index * QUARTER_IN_MS);
      const end = new Date(start.getTime() + QUARTER_IN_MS);
      return { start, end };
    });
  }

  private periodIncludedCondition({ start, end }: IProvidePeriod) {
    return {
      start: { lte: end },
      end: { gte: start },
    };
  }

  private hasTeamCondition(teams: string[]) {
    if (teams.length === 0) return {};
    return {
      teams: { some: { teamCode: { in: teams } } },
    };
  }

  private teamMemberCondition(teams: string[]) {
    const isValidUser = {
      permissions: { some: { permissionName: BE_AFFECTED } },
    };
    const isMemberOf = { code: { in: teams } };

    const teamCondition = teams.length > 0 ? isMemberOf : isValidUser;

    return {
      teams: {
        some: {
          team: teamCondition,
        },
      },
    };
  }
}

function includedPeriods({
  start,
  end,
}: IProvidePeriod): (value: IProvidePeriod) => boolean {
  return (period) => period.start < end && period.end > start;
}
