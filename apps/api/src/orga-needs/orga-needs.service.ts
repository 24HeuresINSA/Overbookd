import { Injectable } from "@nestjs/common";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { IProvidePeriod, Period, QUARTER_IN_MS } from "@overbookd/period";
import { PrismaService } from "../prisma.service";
import { VolunteerAvailability } from "@prisma/client";

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

const IS_NOT_DELETED = { isDeleted: false };
const SELECT_PERIOD = { start: true, end: true };

type RequestedVolunteersOverPeriod = IProvidePeriod & {
  requestedVolunteers: number;
};

type AssignmentsOverPeriod = IProvidePeriod;

type DataBaseOrgaStats = {
  interval: Period;
  assignments: AssignmentsOverPeriod[];
  availabilities: VolunteerAvailability[];
  requestedVolunteers: RequestedVolunteersOverPeriod[];
};

type DataBaseVolunteerAvailability = IProvidePeriod & {
  user: {
    id: number;
    festivalTaskMobilizations: {
      mobilization: IProvidePeriod;
    }[];
    assigned: {
      assignment: IProvidePeriod;
    }[];
  };
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
    interval: Period,
  ) {
    return assignments.filter((assignment) =>
      Period.init(assignment).isOverlapping(interval),
    ).length;
  }

  private countRequestedVolunteersOnInterval(
    requestedVolunteers: RequestedVolunteersOverPeriod[],
    interval: Period,
  ) {
    return requestedVolunteers
      .filter((request) => Period.init(request).isOverlapping(interval))
      .reduce((acc, { requestedVolunteers }) => acc + requestedVolunteers, 0);
  }

  private countAvailableVolunteersOnInterval(
    availabilities: VolunteerAvailability[],
    interval: Period,
  ) {
    return availabilities.filter((availability) =>
      Period.init(availability).isOverlapping(interval),
    ).length;
  }

  private async getRequestedVolunteers(
    orgaNeedsRequest: OrgaNeedsRequest,
  ): Promise<RequestedVolunteersOverPeriod[]> {
    const { teams, ...period } = orgaNeedsRequest;

    const mobilizations = await this.prisma.festivalTaskMobilization.findMany({
      where: {
        ft: IS_NOT_DELETED,
        ...this.periodIncludedCondition(period),
        OR: [
          this.requestTeamMemberCondition(teams),
          this.requestVolunteerWithMembershipCondition(teams),
        ],
      },
      select: {
        ...SELECT_PERIOD,
        ...this.teamMemberRequestsSelection(teams),
        ...this.volunteerWithMembershipRequestsSelection(teams),
      },
    });

    return mobilizations.map(({ start, end, teams, volunteers }) => {
      const teamMembers = teams.reduce((acc, { count }) => acc + count, 0);
      const requestedVolunteers = teamMembers + volunteers.length;

      return { start, end, requestedVolunteers };
    });
  }

  private volunteerWithMembershipRequestsSelection(teams: string[]) {
    const condition = {
      volunteer: { ...IS_NOT_DELETED, ...this.teamMemberCondition(teams) },
    };
    return { volunteers: { select: { volunteerId: true }, where: condition } };
  }

  private teamMemberRequestsSelection(teams: string[]) {
    const condition = this.teamIsSearchedCondition(teams);
    return { teams: { select: { count: true }, where: condition } };
  }

  private teamIsSearchedCondition(teams: string[]) {
    if (teams.length === 0) {
      return {};
    }
    return { teamCode: { in: teams } };
  }

  private requestVolunteerWithMembershipCondition(teams: string[]) {
    const condition = {
      ...IS_NOT_DELETED,
      ...this.teamMemberCondition(teams),
    };
    return { volunteers: { some: { volunteer: condition } } };
  }

  private async getAvailabilities(
    periodWithTeams: OrgaNeedsRequest,
  ): Promise<VolunteerAvailability[]> {
    const { teams, ...period } = periodWithTeams;
    const availabilities = await this.prisma.volunteerAvailability.findMany({
      where: {
        ...this.periodIncludedCondition(period),
        user: {
          ...IS_NOT_DELETED,
          ...this.teamMemberCondition(teams),
        },
      },
      select: this.selectAvailabiliesAndTaksOn(period),
    });

    return this.formatedAvailabilities(availabilities);
  }

  private formatedAvailabilities(
    availabilities: DataBaseVolunteerAvailability[],
  ): VolunteerAvailability[] {
    return availabilities.flatMap(({ user, ...availabilityPeriod }) => {
      const remainingAvailabilities = this.removeTaskFromAvailability(
        availabilityPeriod,
        user.festivalTaskMobilizations,
        user.assigned,
      );

      return remainingAvailabilities.map((availability) => ({
        userId: user.id,
        start: availability.start,
        end: availability.end,
      }));
    });
  }

  private removeTaskFromAvailability(
    availabilityPeriod: IProvidePeriod,
    mobilizations: { mobilization: IProvidePeriod }[],
    assignments: { assignment: IProvidePeriod }[],
  ) {
    const availability = Period.init(availabilityPeriod);

    const notAvailableDuring = this.retrieveNotAvailablePeriods(
      assignments,
      mobilizations,
    );

    return notAvailableDuring.reduce(
      (remainingAvailabilities, notAvailablePeriod) => {
        return remainingAvailabilities.flatMap((availability) => {
          return availability.remove(notAvailablePeriod);
        });
      },
      [availability],
    );
  }

  private retrieveNotAvailablePeriods(
    assignments: { assignment: IProvidePeriod }[],
    mobilizations: { mobilization: IProvidePeriod }[],
  ) {
    const assignmentPeriods = assignments.map(({ assignment }) =>
      Period.init(assignment),
    );
    const mobilizationPeriods = mobilizations.map(({ mobilization }) =>
      Period.init(mobilization),
    );

    return [...assignmentPeriods, ...mobilizationPeriods];
  }

  private selectAvailabiliesAndTaksOn(period: IProvidePeriod) {
    return {
      ...SELECT_PERIOD,
      user: {
        select: {
          id: true,
          assigned: {
            select: { assignment: { select: SELECT_PERIOD } },
            where: {
              assignment: this.periodIncludedCondition(period),
            },
          },
          festivalTaskMobilizations: {
            select: { mobilization: { select: SELECT_PERIOD } },
            where: {
              mobilization: this.periodIncludedCondition(period),
            },
          },
        },
      },
    };
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

  private buildOrgaNeedsIntervals(period: IProvidePeriod): Period[] {
    const numberOfIntervals = Math.floor(
      Period.init(period).duration.inMilliseconds / QUARTER_IN_MS,
    );

    return Array.from({ length: numberOfIntervals }).map((_, index) => {
      const start = new Date(period.start.getTime() + index * QUARTER_IN_MS);
      const end = new Date(start.getTime() + QUARTER_IN_MS);
      return Period.init({ start, end });
    });
  }

  private periodIncludedCondition({ start, end }: IProvidePeriod) {
    return {
      start: { lte: end },
      end: { gte: start },
    };
  }

  private requestTeamMemberCondition(teams: string[]) {
    return { teams: { some: this.teamIsSearchedCondition(teams) } };
  }

  private teamMemberCondition(teams: string[]) {
    if (teams.length === 0) return {};
    const isMemberOf = { code: { in: teams } };

    return { teams: { some: { team: isMemberOf } } };
  }
}
