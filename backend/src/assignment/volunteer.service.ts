import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getOtherAssignableTeams } from 'src/team/underlyingTeams.utils';
import { TimespanWithFtResponseDto } from './dto/ftTimespanResponse.dto';
import { FtTimespanService } from './ftTimespan.service';
import { DatabaseVolunteer, Volunteer } from './types/volunteerTypes';
import { TaskCategory } from '@prisma/client';
import { SELECT_USER_TEAMS } from 'src/user/user.service';
import { AssignmentService } from './assignment.service';

export const WHERE_VALIDATED_USER = {
  team: {
    some: {
      team: {
        permissions: {
          some: {
            permission_name: 'validated-user',
          },
        },
      },
    },
  },
};

const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  charisma: true,
  comment: true,
  ...SELECT_USER_TEAMS,
};

const SELECT_FRIENDS = {
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
export class VolunteerService {
  constructor(
    private prisma: PrismaService,
    private ftTimespan: FtTimespanService,
  ) {}

  async findAllVolunteers(): Promise<Volunteer[]> {
    const volunteers = await this.prisma.user.findMany({
      where: {
        is_deleted: false,
        ...WHERE_VALIDATED_USER,
      },
      select: {
        ...SELECT_VOLUNTEER,
        _count: { select: { assignments: true } },
      },
      orderBy: { charisma: 'desc' },
    });
    return this.formatVolunteers(volunteers);
  }

  async findAvailableVolunteersForFtTimespan(
    timespanId: number,
  ): Promise<Volunteer[]> {
    const [ftCategory, ftTimespan] = await Promise.all([
      this.ftTimespan.getTaskCategory(timespanId),
      this.ftTimespan.findTimespanWithFtAndAssignments(timespanId),
    ]);
    const select = this.buildAssignableVolunteersSelection(
      ftTimespan,
      ftCategory,
    );
    const where = this.buildAssignableVolunteersCondition(ftTimespan);

    const volunteers = await this.prisma.user.findMany({
      select,
      where,
      orderBy: { charisma: 'desc' },
    });
    return this.formatVolunteers(volunteers, ftTimespan.assignees);
  }

  private buildAssignableVolunteersCondition(
    ftTimespan: TimespanWithFtResponseDto,
  ) {
    const requestedTeamCodes = ftTimespan.requestedTeams.map(
      (team) => team.code,
    );
    const assignableTeams = requestedTeamCodes.flatMap((tc) =>
      getOtherAssignableTeams(tc),
    );
    const teams = [...requestedTeamCodes, ...assignableTeams];
    const team = TeamService.buildIsMemberOfCondition(teams);
    const availabilities =
      AssignmentService.buildVolunteerIsAvailableDuringPeriodCondition(
        ftTimespan,
      );

    const assignments =
      AssignmentService.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(
        ftTimespan,
      );

    return {
      ...WHERE_VALIDATED_USER,
      is_deleted: false,
      team,
      availabilities,
      assignments,
    };
  }

  private buildAssignableVolunteersSelection(
    ftTimespan: TimespanWithFtResponseDto,
    category: TaskCategory | null,
  ) {
    const assignablebleVolunteerCondition =
      this.buildAssignableVolunteersCondition(ftTimespan);
    return {
      ...SELECT_VOLUNTEER,
      ...SELECT_FRIENDS,
      _count: {
        select: {
          friends: {
            where: { requestor: assignablebleVolunteerCondition },
          },
          friendRequestors: {
            where: { friend: assignablebleVolunteerCondition },
          },
          assignments: {
            where: {
              timespan: {
                timeWindow: {
                  ft: {
                    category,
                  },
                },
              },
            },
          },
          ftUserRequests: {
            where: {
              ftTimeWindows: {
                start: { lt: ftTimespan.end },
                end: { gt: ftTimespan.start },
              },
            },
          },
        },
      },
    };
  }

  private formatVolunteers(
    volunteers: DatabaseVolunteer[],
    assignees: number[] = [],
  ): Volunteer[] {
    return volunteers.map((volunteer) =>
      this.formatVolunteer(volunteer, assignees),
    );
  }

  private formatVolunteer(
    volunteer: DatabaseVolunteer,
    assignees: number[],
  ): Volunteer {
    return {
      id: volunteer.id,
      firstname: volunteer.firstname,
      lastname: volunteer.lastname,
      comment: volunteer.comment,
      charisma: volunteer.charisma,
      teams: volunteer.team.map((t) => t.team.code),
      assignments: volunteer._count?.assignments ?? 0,
      friendAvailable:
        volunteer?._count.friends + volunteer?._count.friendRequestors > 0,
      isRequestedOnSamePeriod: volunteer?._count?.ftUserRequests > 0,
      hasFriendAssigned: this.hasFriendAssigned(volunteer, assignees),
    };
  }

  private hasFriendAssigned(
    volunteer: DatabaseVolunteer,
    assignees: number[],
  ): boolean {
    if (!volunteer.friends || !volunteer.friendRequestors) {
      return false;
    }
    return volunteer.friends
      .map(({ requestor }) => requestor.id)
      .concat(volunteer.friendRequestors.map(({ friend }) => friend.id))
      .some((id) => assignees.some((assignee) => assignee === id));
  }
}
