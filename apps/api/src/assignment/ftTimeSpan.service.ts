import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskCategory } from '@prisma/client';
import { ftStatuses } from 'src/ft/ft.model';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getUnderlyingTeams } from 'src/team/underlyingTeams.utils';
import { SELECT_USER_TEAMS, UserService } from 'src/user/user.service';
import { PeriodDto } from 'src/volunteer-availability/dto/period.dto';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import { SELECT_BASE_TIMESPAN } from './assignment.service';
import {
  Assignee,
  AssignmentAsTeamMember,
  AvailableTimeSpan,
  DatabaseAssigneeWithFriends,
  DatabaseAssigneeWithTeams,
  DatabaseAssignmentsAsTeamMember,
  DatabaseFtWithTimeSpans,
  DatabaseRequestedTeam,
  DatabaseTimeSpanWithAssignedTeamMembers,
  DatabaseTimeSpanWithAssignees,
  DatabaseTimeSpanWithFt,
  DatabaseTimeSpanWithFtAndAssignees,
  DatabaseTimeWindow,
  FtWithTimeSpan,
  RequestedTeam,
  SELECT_FT_WITH_TIMESPANS,
  SELECT_TIMESPAN_WITH_FT,
  SELECT_TIMESPAN_WITH_FT_AND_ASSIGNMENTS,
  TimeSpan,
  TimeSpanAssignee,
  TimeSpanWithAssignees,
  TimeSpanWithFt,
  TimeSpanWithFtAndAssignees,
} from './types/ftTimeSpanTypes';

const WHERE_EXISTS_AND_READY = {
  isDeleted: false,
  status: ftStatuses.READY,
};

const WHERE_FT_EXISTS_AND_READY = {
  ft: WHERE_EXISTS_AND_READY,
};

const WHERE_HAS_TEAM_REQUESTS = {
  timeWindows: {
    some: {
      teamRequests: {
        some: {},
      },
    },
  },
};

const SELECT_FT_TIMESPANS_WITH_STATS = {
  timeWindows: {
    select: {
      teamRequests: {
        select: {
          teamCode: true,
          quantity: true,
          _count: {
            select: {
              assignments: true,
            },
          },
        },
      },
      timeSpans: {
        select: {
          id: true,
          start: true,
          end: true,
          assignments: {
            select: {
              teamRequest: {
                select: {
                  teamCode: true,
                },
              },
            },
            where: {
              userRequest: null,
            },
          },
        },
      },
    },
  },
};

const SELECT_FT_WITH_LOCATION = {
  ft: {
    select: {
      id: true,
      name: true,
      location: {
        select: {
          name: true,
        },
      },
    },
  },
};

const SELECT_ASSIGNEE = {
  id: true,
  firstname: true,
  lastname: true,
  phone: true,
};

const SELECT_ASSIGNED_TEAM = {
  teamRequest: {
    select: {
      teamCode: true,
    },
  },
};

export const SELECT_FRIENDS = {
  friends: {
    select: {
      requestor: {
        select: {
          id: true,
        },
      },
    },
  },
  friendRequestors: {
    select: {
      friend: {
        select: {
          id: true,
        },
      },
    },
  },
};

@Injectable()
export class FtTimeSpanService {
  constructor(
    private prisma: PrismaService,
    private volunteerAvailability: VolunteerAvailabilityService,
    private user: UserService,
  ) {}

  async findAllFtsWithTimeSpans(): Promise<FtWithTimeSpan[]> {
    const fts = await this.prisma.ft.findMany({
      where: {
        ...WHERE_EXISTS_AND_READY,
        ...WHERE_HAS_TEAM_REQUESTS,
      },
      select: SELECT_FT_WITH_TIMESPANS,
    });
    return this.formatFtsWithTimeSpans(fts);
  }

  async findTimeSpansForFt(ftId: number): Promise<TimeSpan[]> {
    const ft = await this.prisma.ft.findFirst({
      where: {
        id: ftId,
        ...WHERE_EXISTS_AND_READY,
        ...WHERE_HAS_TEAM_REQUESTS,
      },
      select: SELECT_FT_TIMESPANS_WITH_STATS,
    });

    if (!ft) {
      throw new NotFoundException(`FT with id ${ftId} not found`);
    }

    return this.formatTimeSpansWithStatsResponse(ft);
  }

  async findTimeSpanWithFt(timeSpanId: number): Promise<TimeSpanWithFt> {
    const timeSpan = await this.prisma.ftTimeSpan.findFirst({
      where: {
        id: timeSpanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: SELECT_TIMESPAN_WITH_FT,
    });
    if (!timeSpan) {
      throw new NotFoundException(`Time span with id ${timeSpanId} not found`);
    }
    return this.formatTimeSpanWithFt(timeSpan);
  }

  async findTimeSpanWithAssignees(
    timeSpanId: number,
  ): Promise<TimeSpanWithAssignees> {
    const select = this.buildTimeSpanWithAssigneesSelection(timeSpanId);
    const timeSpan = await this.prisma.ftTimeSpan.findFirst({
      where: {
        id: timeSpanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select,
    });
    return this.formatTimeSpanWithDetails(timeSpan);
  }

  async findTimeSpanWithFtAndAssignment(
    timeSpanId: number,
  ): Promise<TimeSpanWithFtAndAssignees> {
    const ftTimeSpan = await this.prisma.ftTimeSpan.findFirst({
      where: {
        id: timeSpanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: SELECT_TIMESPAN_WITH_FT_AND_ASSIGNMENTS,
    });
    if (!ftTimeSpan) {
      throw new NotFoundException(`Time span with id ${timeSpanId} not found`);
    }
    return this.formatTimeSpanWithFtAndAssignees(ftTimeSpan);
  }

  async findTimeSpansWithFtWhereVolunteerIsAssignableTo(
    volunteerId: number,
  ): Promise<AvailableTimeSpan[]> {
    const [volunteerTeams, availabilities, requests, assignments, friends] =
      await Promise.all([
        this.user.getUserTeams(volunteerId),
        this.volunteerAvailability.findUserAvailabilities(volunteerId),
        this.user.getFtUserRequestsByUserId(volunteerId),
        this.user.getVolunteerAssignments(volunteerId),
        this.findAllVolunteerFriends(volunteerId),
      ]);

    const busyPeriods = [...requests, ...assignments];

    const where = this.buildAssignableToTimeSpanCondition(
      volunteerTeams,
      availabilities,
      busyPeriods,
    );

    const timeSpans = await this.prisma.ftTimeSpan.findMany({
      select: SELECT_TIMESPAN_WITH_FT_AND_ASSIGNMENTS,
      where,
      orderBy: { start: 'asc' },
    });
    return this.formatAvailableForVolunteerTimeSpans(timeSpans, friends);
  }

  async getTaskCategory(timeSpanId: number): Promise<TaskCategory | null> {
    const ftTimeSpan = await this.prisma.ftTimeSpan.findFirst({
      where: {
        id: timeSpanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: {
        timeWindow: {
          select: {
            ft: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });
    if (!ftTimeSpan) {
      throw new NotFoundException(`Créneau ${timeSpanId} non trouvé`);
    }
    return ftTimeSpan.timeWindow.ft.category;
  }

  private async findAllVolunteerFriends(
    volunteerId: number,
  ): Promise<number[]> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id: volunteerId },
      select: { ...SELECT_FRIENDS },
    });
    return [
      ...volunteer.friendRequestors.map(({ friend }) => friend.id),
      ...volunteer.friends.map(({ requestor }) => requestor.id),
    ];
  }

  private buildAssignableToTimeSpanCondition(
    volunteerTeams: string[],
    availabilities: PeriodDto[],
    busyPeriods: PeriodDto[],
  ) {
    const underlyingTeams = getUnderlyingTeams(volunteerTeams);
    const teams = [...volunteerTeams, ...underlyingTeams];
    const teamRequests = TeamService.buildIsMemberOfCondition(teams);

    const availabilitiesCondition = this.buildTimeSpanConditionOverAvailability(
      availabilities,
      busyPeriods,
    );

    return {
      timeWindow: {
        teamRequests,
        ...WHERE_FT_EXISTS_AND_READY,
      },
      ...availabilitiesCondition,
    };
  }

  private buildTimeSpanConditionOverAvailability(
    availabilities: PeriodDto[],
    busyPeriods: PeriodDto[],
  ) {
    return {
      OR: availabilities.map((availability) => ({
        start: {
          gte: availability.start,
        },
        end: {
          lte: availability.end,
        },
      })),
      NOT: busyPeriods.map(({ start, end }) => ({
        start: {
          lt: end,
        },
        end: {
          gt: start,
        },
      })),
    };
  }

  private buildTimeSpanWithAssigneesSelection(timeSpanId: number) {
    const SELECT_REQUESTED_TEAMS = {
      teamRequests: {
        select: {
          teamCode: true,
          quantity: true,
          _count: {
            select: {
              assignments: { where: { timeSpanId } },
            },
          },
        },
      },
    };

    const SELECT_VOLUNTEERS_ALSO_ASSIGNED_ASKING_ME_AS_FRIEND = {
      friends: {
        select: {
          requestor: {
            select: SELECT_ASSIGNEE,
          },
        },
        where: {
          requestor: {
            assignments: {
              some: { timeSpanId },
            },
          },
        },
      },
    };

    const SELECT_VOLUNTEERS_ALSO_ASSIGNED_ASKED_AS_MY_FRIEND = {
      friendRequestors: {
        select: {
          friend: {
            select: SELECT_ASSIGNEE,
          },
        },
        where: {
          friend: {
            assignments: {
              some: { timeSpanId },
            },
          },
        },
      },
    };

    const SELECT_TIMESPAN_WITH_ASSIGNEES = {
      ...SELECT_BASE_TIMESPAN,
      timeWindow: {
        select: {
          ...SELECT_REQUESTED_TEAMS,
          ...SELECT_FT_WITH_LOCATION,
        },
      },
      assignments: {
        select: {
          assignee: {
            select: {
              ...SELECT_ASSIGNEE,
              ...SELECT_USER_TEAMS,
              ...SELECT_VOLUNTEERS_ALSO_ASSIGNED_ASKING_ME_AS_FRIEND,
              ...SELECT_VOLUNTEERS_ALSO_ASSIGNED_ASKED_AS_MY_FRIEND,
            },
          },
          ...SELECT_ASSIGNED_TEAM,
        },
      },
    };

    return SELECT_TIMESPAN_WITH_ASSIGNEES;
  }

  private formatAvailableForVolunteerTimeSpans(
    ftTimeSpans: DatabaseTimeSpanWithFtAndAssignees[],
    friends: number[],
  ): AvailableTimeSpan[] {
    return ftTimeSpans.map((ts) => {
      const hasFriendsAssigned = ts.assignments.some(({ assignee }) =>
        friends.includes(assignee.id),
      );
      return { ...this.formatTimeSpanWithFt(ts), hasFriendsAssigned };
    });
  }

  private formatTimeSpanWithFt(
    ftTimeSpan: DatabaseTimeSpanWithFt,
  ): TimeSpanWithFt {
    const requestedTeams = this.formatRequestedTeams(
      ftTimeSpan.timeWindow.teamRequests,
      ftTimeSpan.assignments,
    );
    return {
      id: ftTimeSpan.id,
      start: ftTimeSpan.start,
      end: ftTimeSpan.end,
      ft: {
        id: ftTimeSpan.timeWindow.ft.id,
        name: ftTimeSpan.timeWindow.ft.name,
        hasPriority: ftTimeSpan.timeWindow.ft.hasPriority,
        category: ftTimeSpan.timeWindow.ft.category,
      },
      requestedTeams,
    };
  }

  private formatTimeSpanWithFtAndAssignees(
    timeSpan: DatabaseTimeSpanWithFtAndAssignees,
  ): TimeSpanWithFtAndAssignees {
    const assignees = formatTimeSpanAssignees(timeSpan);
    return {
      ...this.formatTimeSpanWithFt(timeSpan),
      assignees,
    };
  }

  private formatFtsWithTimeSpans(
    fts: DatabaseFtWithTimeSpans[],
  ): FtWithTimeSpan[] {
    return fts.map((ft) => this.formatFtWithTimeSpans(ft));
  }

  private formatFtWithTimeSpans(ft: DatabaseFtWithTimeSpans): FtWithTimeSpan {
    const timeSpans = ft.timeWindows.flatMap((tw) => {
      return tw.timeSpans.map((ts) => {
        const requestedTeams = this.formatRequestedTeams(
          tw.teamRequests,
          ts.assignments,
        );
        return {
          id: ts.id,
          start: ts.start,
          end: ts.end,
          requestedTeams,
        };
      });
    });
    return {
      id: ft.id,
      name: ft.name,
      hasPriority: ft.hasPriority,
      category: ft.category,
      timeSpans,
    };
  }

  private formatRequestedTeams(
    requestedTeams: DatabaseRequestedTeam[],
    assignments: AssignmentAsTeamMember[],
  ): RequestedTeam[] {
    return requestedTeams.map(({ teamCode, quantity }) => {
      const assignmentCount = countAssignedMembers(teamCode, assignments);
      return { code: teamCode, quantity, assignmentCount };
    });
  }

  private formatTimeSpansWithStatsResponse(ft: {
    timeWindows: DatabaseTimeWindow[];
  }): TimeSpan[] {
    return ft.timeWindows.flatMap(({ timeSpans, teamRequests }) =>
      timeSpans.flatMap(convertToTimeSpan(teamRequests)),
    );
  }

  private formatTimeSpanWithDetails(
    timeSpan: DatabaseTimeSpanWithAssignees,
  ): TimeSpanWithAssignees {
    const { id, start, end, assignments, timeWindow } = timeSpan;
    const { teamRequests } = timeWindow;
    const ft = {
      id: timeWindow.ft.id,
      name: timeWindow.ft.name,
      location: timeWindow.ft.location.name,
    };
    const requestedTeams = this.formatRequestedTeams(teamRequests, assignments);
    return {
      id,
      start,
      end,
      ft,
      requestedTeams,
      requiredVolunteers: assignments
        .filter(({ teamRequest }) => teamRequest === null)
        .map(({ assignee }) => convertToAssignee(assignee)),
      assignees: assignments
        .filter(({ teamRequest }) => teamRequest !== null)
        .map(convertToTimeSpanAssignee),
    };
  }
}

function convertToTimeSpan(
  teamRequests: DatabaseRequestedTeam[],
): (value: DatabaseTimeSpanWithAssignedTeamMembers) => TimeSpan {
  return ({ assignments, ...timeSpan }) => {
    const requestedTeams = teamRequests.map((teamRequest) =>
      convertToRequestedTeam(teamRequest, assignments),
    );
    return {
      ...timeSpan,
      requestedTeams,
    };
  };
}

function formatTimeSpanAssignees(
  ftTimeSpan: DatabaseTimeSpanWithFtAndAssignees,
): number[] {
  return ftTimeSpan.assignments.map(({ assignee }) => assignee.id);
}

function convertToRequestedTeam(
  teamRequest: DatabaseRequestedTeam,
  assignments: AssignmentAsTeamMember[],
): RequestedTeam {
  const assignmentCount = countMemberAssigned(
    assignments,
    teamRequest.teamCode,
  );
  return {
    code: teamRequest.teamCode,
    quantity: teamRequest.quantity,
    assignmentCount,
  };
}

function countMemberAssigned(
  assignments: AssignmentAsTeamMember[],
  code: string,
) {
  return assignments.filter(({ teamRequest }) => teamRequest?.teamCode === code)
    .length;
}

function convertToAssignee({
  id,
  lastname,
  firstname,
  phone,
  team,
}: DatabaseAssigneeWithTeams): Assignee {
  const teams = team.map(({ team }) => team.code);
  return { id, lastname, firstname, phone, teams };
}

function convertToTimeSpanAssignee({
  assignee,
  teamRequest,
}: DatabaseAssignmentsAsTeamMember): TimeSpanAssignee {
  const friends = extractDeduplicatedFriends(assignee);

  return {
    ...convertToAssignee(assignee),
    assignedTeam: teamRequest.teamCode,
    friends,
  };
}

function extractDeduplicatedFriends(assignee: DatabaseAssigneeWithFriends) {
  const friends = [
    ...assignee.friends.map(({ requestor }) => requestor),
    ...assignee.friendRequestors.map(({ friend }) => friend),
  ];
  return friends.reduce(deduplicateFriends, [] as Assignee[]);
}

function deduplicateFriends(
  friends: Assignee[],
  currentFriend: Assignee,
): Assignee[] {
  const exist = friends.find(({ id }) => id === currentFriend.id);
  if (exist) return friends;
  return [...friends, currentFriend];
}

function countAssignedMembers(
  teamCode: string,
  assignments: AssignmentAsTeamMember[],
): number {
  return assignments.filter(
    ({ teamRequest }) => teamRequest?.teamCode === teamCode,
  ).length;
}
