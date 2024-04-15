import { Injectable } from "@nestjs/common";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { IProvidePeriod, Period, QUARTER_IN_MS } from "@overbookd/period";
import { PrismaService } from "../prisma.service";
import { VolunteerAvailability } from "@prisma/client";
import { FestivalTask } from "@overbookd/festival-event";
import {
  OrgaNeedDetails,
  OrgaNeedRequest,
  OrgaNeedTask,
} from "@overbookd/http";

const IS_NOT_DELETED = { isDeleted: false };
const SELECT_PERIOD = { start: true, end: true };

type RequestedVolunteersOverPeriod = IProvidePeriod & {
  requestedVolunteers: number;
};

type AssignmentsOverPeriod = IProvidePeriod;

type DatabaseOrgaStats = {
  interval: Period;
  assignments: AssignmentsOverPeriod[];
  availabilities: VolunteerAvailability[];
  requestedVolunteers: RequestedVolunteersOverPeriod[];
  tasks: OrgaNeedTaskWithPeriod[];
};

type OrgaNeedTaskWithPeriod = OrgaNeedTask & IProvidePeriod;

type DatabaseTask = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
  mobilizations: {
    end: Date;
    start: Date;
    teams: { count: number }[];
  }[];
};

type DatabaseVolunteerAvailability = IProvidePeriod & {
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
    periodAndTeams: OrgaNeedRequest,
  ): Promise<OrgaNeedDetails[]> {
    const intervals = this.buildOrgaNeedsIntervals(periodAndTeams);

    const [assignments, availabilities, requestedVolunteers, tasks] =
      await Promise.all([
        this.getAssignments(periodAndTeams),
        this.getAvailabilities(periodAndTeams),
        this.getRequestedVolunteers(periodAndTeams),
        this.getTasksAt(periodAndTeams),
      ]);

    return intervals.map((interval) =>
      this.formatIntervalStats({
        interval,
        assignments,
        availabilities,
        requestedVolunteers,
        tasks,
      }),
    );
  }

  private formatIntervalStats({
    interval,
    assignments,
    availabilities,
    requestedVolunteers,
    tasks,
  }: DatabaseOrgaStats): OrgaNeedDetails {
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

    const tasksForInterval = this.listTasksOnInterval(tasks, interval);

    return {
      ...interval,
      assignedVolunteers,
      availableVolunteers,
      requestedVolunteers: requestedVolunteersForInterval,
      tasks: tasksForInterval,
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

  private listTasksOnInterval(
    tasks: OrgaNeedTaskWithPeriod[],
    interval: Period,
  ): OrgaNeedTask[] {
    return tasks.filter((task) => Period.init(task).equals(interval));
  }

  private async getRequestedVolunteers(
    orgaNeedRequest: OrgaNeedRequest,
  ): Promise<RequestedVolunteersOverPeriod[]> {
    const { teams, ...period } = orgaNeedRequest;

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
    periodWithTeams: OrgaNeedRequest,
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

    return this.formattedAvailabilities(availabilities);
  }

  private formattedAvailabilities(
    availabilities: DatabaseVolunteerAvailability[],
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
    orgaNeedRequest: OrgaNeedRequest,
  ): Promise<AssignmentsOverPeriod[]> {
    const assignedTasks = {
      assigned: {
        where: { assignment: this.periodIncludedCondition(orgaNeedRequest) },
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
            ...this.periodIncludedCondition(orgaNeedRequest),
          },
        },
        select: { mobilization: { select: SELECT_PERIOD } },
      },
    };

    const assignees = await this.prisma.user.findMany({
      where: {
        ...IS_NOT_DELETED,
        ...this.teamMemberCondition(orgaNeedRequest.teams),
        ...this.assignedOrPartOfMobilizationDuring(orgaNeedRequest),
      },
      select: { ...assignedTasks, ...mobilizationsHeWillBePartOf },
    });

    return assignees.flatMap(({ assigned, festivalTaskMobilizations }) => [
      ...assigned.map(({ assignment }) => assignment),
      ...festivalTaskMobilizations.map(({ mobilization }) => mobilization),
    ]);
  }

  private async getTasksAt({
    teams,
    ...period
  }: OrgaNeedRequest): Promise<OrgaNeedTaskWithPeriod[]> {
    const isValidMobilization = {
      AND: [
        this.periodIncludedCondition(period),
        this.requestTeamMemberCondition(teams),
      ],
    };

    const tasks = await this.prisma.festivalTask.findMany({
      where: {
        ...IS_NOT_DELETED,
        mobilizations: {
          some: isValidMobilization,
        },
      },
      select: {
        id: true,
        name: true,
        mobilizations: {
          where: isValidMobilization,
          select: {
            start: true,
            end: true,
            teams: {
              where: this.teamIsSearchedCondition(teams),
              select: { count: true },
            },
          },
        },
      },
    });

    const splittedPeriods = this.buildOrgaNeedsIntervals(period);
    return splittedPeriods.flatMap((period) =>
      this.retrieveTasksOnPeriod(tasks, period),
    );
  }

  private retrieveTasksOnPeriod(
    tasks: DatabaseTask[],
    period: Period,
  ): OrgaNeedTaskWithPeriod[] {
    return tasks.map(({ id, name, mobilizations }) => {
      const overlapped = mobilizations.filter((mobilization) =>
        period.isOverlapping(Period.init(mobilization)),
      );
      const count = overlapped.reduce(
        (acc, { teams }) =>
          acc + teams.reduce((acc, { count }) => acc + count, 0),
        0,
      );
      return { id, name, count, start: period.start, end: period.end };
    });
  }

  private buildOrgaNeedsIntervals(period: IProvidePeriod): Period[] {
    return Period.init(period).splitWithIntervalInMs(QUARTER_IN_MS);
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
