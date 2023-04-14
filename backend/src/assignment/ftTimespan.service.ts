import { Injectable, NotFoundException } from '@nestjs/common';
import { FtStatus, TaskCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getUnderlyingTeams } from 'src/team/underlyingTeams.utils';
import { UserService } from 'src/user/user.service';
import { PeriodDto } from 'src/volunteer-availability/dto/period.dto';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import {
  DatabaseFtWithTimespans,
  DatabaseRequestedTeam,
  DatabaseTimespanWithFt,
  Timespan,
  SELECT_FT_WITH_TIMESPANS,
  SELECT_TIMESPAN_WITH_FT,
  RequestedTeam,
  DatabaseTimeWindow,
  FtWithTimespan,
  DatabaseTimespanWithAssignedTeamMembers,
  TimespanWithFt,
  SELECT_TIMESPAN_WITH_FT_AND_ASSIGNMENTS,
  TimespanWithFtAndAssignees,
  DatabaseTimespanWithFtAndAssignees,
  TimespanWithAssignees,
  DatabaseTimespanWithAssignees,
  Assignee,
  DatabaseAssignee,
  DatabaseAssignmentsAsTeamMember,
  TimespanAssignee,
  AssignmentAsTeamMember,
  AvailableTimespan as AvailableTimespan,
} from './types/ftTimespanTypes';

const WHERE_EXISTS_AND_READY = {
  isDeleted: false,
  status: FtStatus.READY,
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
      timespans: {
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

const SELECT_BASE_TIMESPAN = { id: true, start: true, end: true };

const SELECT_ASSIGNEE = {
  id: true,
  firstname: true,
  lastname: true,
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
export class FtTimespanService {
  constructor(
    private prisma: PrismaService,
    private volunteerAvailability: VolunteerAvailabilityService,
    private user: UserService,
  ) {}

  async findAllFtsWithTimespans(): Promise<FtWithTimespan[]> {
    const fts = await this.prisma.ft.findMany({
      where: {
        ...WHERE_EXISTS_AND_READY,
        ...WHERE_HAS_TEAM_REQUESTS,
      },
      select: SELECT_FT_WITH_TIMESPANS,
    });
    return this.formatFtsWithTimespans(fts);
  }

  async findTimespansForFt(ftId: number): Promise<Timespan[]> {
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

    return this.formatTimespansWithStatsResponse(ft);
  }

  async findTimespanWithFt(timespanId: number): Promise<TimespanWithFt> {
    const ftTimespan = await this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: SELECT_TIMESPAN_WITH_FT,
    });
    if (!ftTimespan) {
      throw new NotFoundException(`Timespan with id ${timespanId} not found`);
    }
    return this.formatTimespanWithFt(ftTimespan);
  }

  async findTimespanWithAssignees(
    timespanId: number,
  ): Promise<TimespanWithAssignees> {
    const select = this.buildTimespanWithAssigneesSelection(timespanId);
    const timespan = await this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select,
    });
    return this.formatTimespanWithDetails(timespan);
  }

  async findTimespanWithFtAndAssignment(
    timespanId: number,
  ): Promise<TimespanWithFtAndAssignees> {
    const ftTimespan = await this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: SELECT_TIMESPAN_WITH_FT_AND_ASSIGNMENTS,
    });
    if (!ftTimespan) {
      throw new NotFoundException(`Timespan with id ${timespanId} not found`);
    }
    return this.formatTimespanWithFtAndAssignees(ftTimespan);
  }

  async findTimespansWithFtWhereVolunteerIsAssignableTo(
    volunteerId: number,
  ): Promise<AvailableTimespan[]> {
    const [volunteerTeams, availabilities, requests, assignments, friends] =
      await Promise.all([
        this.user.getUserTeams(volunteerId),
        this.volunteerAvailability.findUserAvailabilities(volunteerId),
        this.user.getFtUserRequestsByUserId(volunteerId),
        this.user.getVolunteerAssignments(volunteerId),
        this.findAllVolunteerFriends(volunteerId),
      ]);

    const busyPeriods = [...requests, ...assignments];

    const where = this.buildAssignableToTimespanCondition(
      volunteerTeams,
      availabilities,
      busyPeriods,
    );

    const timespans = await this.prisma.ftTimespan.findMany({
      select: SELECT_TIMESPAN_WITH_FT_AND_ASSIGNMENTS,
      where,
      orderBy: { start: 'asc' },
    });
    return this.formatAvailableForVolunteerTimespans(timespans, friends);
  }

  async getTaskCategory(timespanId: number): Promise<TaskCategory | null> {
    const ftTimespan = await this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
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
    if (!ftTimespan) {
      throw new NotFoundException(`Créneau ${timespanId} non trouvé`);
    }
    return ftTimespan.timeWindow.ft.category;
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

  private buildAssignableToTimespanCondition(
    volunteerTeams: string[],
    availabilities: PeriodDto[],
    busyPeriods: PeriodDto[],
  ) {
    const underlyingTeams = getUnderlyingTeams(volunteerTeams);
    const teams = [...volunteerTeams, ...underlyingTeams];
    const teamRequests = TeamService.buildIsMemberOfCondition(teams);

    const availabilitiesCondition = this.buildTimespanConditionOverAvailability(
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

  private buildTimespanConditionOverAvailability(
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

  private buildTimespanWithAssigneesSelection(timespanId: number) {
    const SELECT_REQUESTED_TEAMS = {
      teamRequests: {
        select: {
          teamCode: true,
          quantity: true,
          _count: {
            select: {
              assignments: { where: { timespanId } },
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
              some: {
                timespanId,
              },
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
              some: {
                timespanId,
              },
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

  private formatAvailableForVolunteerTimespans(
    ftTimespans: DatabaseTimespanWithFtAndAssignees[],
    friends: number[],
  ): AvailableTimespan[] {
    return ftTimespans.map((ts) => {
      const hasFriendsAssigned = ts.assignments.some(({ assignee }) =>
        friends.includes(assignee.id),
      );
      return { ...this.formatTimespanWithFt(ts), hasFriendsAssigned };
    });
  }

  private formatTimespanWithFt(
    ftTimespan: DatabaseTimespanWithFt,
  ): TimespanWithFt {
    const requestedTeams = this.formatRequestedTeams(
      ftTimespan.timeWindow.teamRequests,
      ftTimespan.assignments,
    );
    return {
      id: ftTimespan.id,
      start: ftTimespan.start,
      end: ftTimespan.end,
      ft: {
        id: ftTimespan.timeWindow.ft.id,
        name: ftTimespan.timeWindow.ft.name,
        hasPriority: ftTimespan.timeWindow.ft.hasPriority,
        category: ftTimespan.timeWindow.ft.category,
      },
      requestedTeams,
    };
  }

  private formatTimespanWithFtAndAssignees(
    timespan: DatabaseTimespanWithFtAndAssignees,
  ): TimespanWithFtAndAssignees {
    const assignees = formatTimespanAssignees(timespan);
    return {
      ...this.formatTimespanWithFt(timespan),
      assignees,
    };
  }

  private formatFtsWithTimespans(
    fts: DatabaseFtWithTimespans[],
  ): FtWithTimespan[] {
    return fts.map((ft) => this.formatFtWithTimespans(ft));
  }

  private formatFtWithTimespans(ft: DatabaseFtWithTimespans): FtWithTimespan {
    const timespans = ft.timeWindows.flatMap((tw) => {
      return tw.timespans.map((ts) => {
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
      timespans,
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

  private formatTimespansWithStatsResponse(ft: {
    timeWindows: DatabaseTimeWindow[];
  }): Timespan[] {
    return ft.timeWindows.flatMap(({ timespans, teamRequests }) =>
      timespans.flatMap(convertToTimespan(teamRequests)),
    );
  }

  private formatTimespanWithDetails(
    timespan: DatabaseTimespanWithAssignees,
  ): TimespanWithAssignees {
    const { id, start, end, assignments, timeWindow } = timespan;
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
        .map(convertToTimespanAssignee),
    };
  }
}

function convertToTimespan(
  teamRequests: DatabaseRequestedTeam[],
): (value: DatabaseTimespanWithAssignedTeamMembers) => Timespan {
  return ({ assignments, ...timespan }) => {
    const requestedTeams = teamRequests.map((teamRequest) =>
      convertToRequestedTeam(teamRequest, assignments),
    );
    return {
      ...timespan,
      requestedTeams,
    };
  };
}

function formatTimespanAssignees(
  ftTimespan: DatabaseTimespanWithFtAndAssignees,
): number[] {
  return ftTimespan.assignments.map(({ assignee }) => assignee.id);
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
}: DatabaseAssignee): Assignee {
  return { id, lastname, firstname };
}

function convertToTimespanAssignee({
  assignee,
  teamRequest,
}: DatabaseAssignmentsAsTeamMember): TimespanAssignee {
  const friends = extractDeduplicatedFriends(assignee);

  return {
    id: assignee.id,
    firstname: assignee.firstname,
    lastname: assignee.lastname,
    assignedTeam: teamRequest.teamCode,
    friends,
  };
}

function extractDeduplicatedFriends(assignee: DatabaseAssignee) {
  return [
    ...assignee.friends.map(({ requestor }) => requestor),
    ...assignee.friendRequestors.map(({ friend }) => friend),
  ].reduce(deduplicateFriends, [] as Assignee[]);
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
