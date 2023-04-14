import { Injectable } from '@nestjs/common';
import { TaskCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getOtherAssignableTeams } from 'src/team/underlyingTeams.utils';
import { SELECT_USER_TEAMS } from 'src/user/user.service';
import { AssignmentService } from './assignment.service';
import { FtTimespanService, SELECT_FRIENDS } from './ftTimespan.service';
import {
  AvailableVolunteer,
  DatabaseVolunteer,
  DatabaseVolunteerWithFriendRequests,
  Volunteer,
} from './types/volunteerTypes';
import { getPeriodDuration } from 'src/utils/duration';
import { TimespanWithFt } from './types/ftTimespanTypes';

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

const SELECT_TIMESPAN_PERIOD = {
  timespan: {
    select: {
      start: true,
      end: true,
    },
  },
};

const SELECT_ASSIGNMENTS_PERIOD = {
  assignments: {
    select: SELECT_TIMESPAN_PERIOD,
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
        ...SELECT_ASSIGNMENTS_PERIOD,
      },
      orderBy: { charisma: 'desc' },
    });
    return this.formatVolunteers(volunteers);
  }

  async findAvailableVolunteersForFtTimespan(
    timespanId: number,
  ): Promise<AvailableVolunteer[]> {
    const [ftCategory, ftTimespan] = await Promise.all([
      this.ftTimespan.getTaskCategory(timespanId),
      this.ftTimespan.findTimespanWithFtAndAssignment(timespanId),
    ]);
    const select = {
      ...this.buildAssignableVolunteersSelection(ftTimespan, ftCategory),
      ...SELECT_FRIENDS,
    };
    const where = this.buildAssignableVolunteersCondition(ftTimespan);

    const volunteers = await this.prisma.user.findMany({
      select,
      where,
      orderBy: { charisma: 'desc' },
    });
    return this.formatAvailableVolunteers(volunteers, ftTimespan.assignees);
  }

  async findAvailableVolunteerFriendsForFtTimespan(
    timespanId: number,
    volunteerId: number,
  ): Promise<Volunteer[]> {
    const [ftCategory, ftTimespan] = await Promise.all([
      this.ftTimespan.getTaskCategory(timespanId),
      this.ftTimespan.findTimespanWithFt(timespanId),
    ]);
    const select = this.buildAssignableVolunteersSelection(
      ftTimespan,
      ftCategory,
    );
    const isAssignable = this.buildAssignableVolunteersCondition(ftTimespan);
    const isFriend = this.buildIsVolunteerFriendCondition(volunteerId);

    const volunteers = await this.prisma.user.findMany({
      select,
      where: {
        ...isAssignable,
        ...isFriend,
      },
    });
    return this.formatVolunteers(volunteers);
  }

  private buildIsVolunteerFriendCondition(volunteerId: number) {
    return {
      OR: [
        { friends: { some: { requestorId: volunteerId } } },
        { friendRequestors: { some: { friendId: volunteerId } } },
      ],
    };
  }

  private buildAssignableVolunteersCondition(ftTimespan: TimespanWithFt) {
    const requestedTeamCodes = ftTimespan.requestedTeams
      .filter(({ quantity, assignmentCount }) => quantity > assignmentCount)
      .map((team) => team.code);
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
    ftTimespan: TimespanWithFt,
    category: TaskCategory | null,
  ) {
    const assignablebleVolunteerCondition =
      this.buildAssignableVolunteersCondition(ftTimespan);

    const SELECT_ASSIGNMENTS_PERIOD_BY_CATEGORY = {
      assignments: {
        select: SELECT_TIMESPAN_PERIOD,
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
    };

    return {
      ...SELECT_VOLUNTEER,
      ...SELECT_ASSIGNMENTS_PERIOD_BY_CATEGORY,
      _count: {
        select: {
          friends: {
            where: { requestor: assignablebleVolunteerCondition },
          },
          friendRequestors: {
            where: { friend: assignablebleVolunteerCondition },
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

  private formatVolunteers(volunteers: DatabaseVolunteer[]): Volunteer[] {
    return volunteers.map((volunteer) => this.formatVolunteer(volunteer));
  }

  private formatAvailableVolunteers(
    volunteers: DatabaseVolunteerWithFriendRequests[],
    assignees: number[],
  ): AvailableVolunteer[] {
    return volunteers.map((volunteer) =>
      this.formatAvailableVolunteer(volunteer, assignees),
    );
  }

  private formatVolunteer(volunteer: DatabaseVolunteer): Volunteer {
    const assignmentDuration = volunteer.assignments.reduce(
      (acc, assignment) => acc + getPeriodDuration(assignment.timespan),
      0,
    );

    return {
      id: volunteer.id,
      firstname: volunteer.firstname,
      lastname: volunteer.lastname,
      comment: volunteer.comment,
      charisma: volunteer.charisma,
      teams: volunteer.team.map((t) => t.team.code),
      assignmentDuration,
    };
  }

  private formatAvailableVolunteer(
    volunteer: DatabaseVolunteerWithFriendRequests,
    assignees: number[],
  ): AvailableVolunteer {
    const { _count: count } = volunteer;
    const friendAvailable = count.friends + count.friendRequestors > 0;
    const hasFriendAssigned = this.hasFriendAssigned(volunteer, assignees);
    const isRequestedOnSamePeriod = volunteer._count?.ftUserRequests > 0;
    return {
      ...this.formatVolunteer(volunteer),
      friendAvailable,
      isRequestedOnSamePeriod,
      hasFriendAssigned,
    };
  }

  private hasFriendAssigned(
    volunteer: DatabaseVolunteerWithFriendRequests,
    assignees: number[],
  ): boolean {
    return volunteer.friends
      .map(({ requestor }) => requestor.id)
      .concat(volunteer.friendRequestors.map(({ friend }) => friend.id))
      .some((id) => assignees.some((assignee) => assignee === id));
  }
}
