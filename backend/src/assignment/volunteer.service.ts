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

@Injectable()
export class VolunteerService {
  constructor(
    private prisma: PrismaService,
    private ftTimespan: FtTimespanService,
    private assignmentService: AssignmentService,
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
      this.ftTimespan.findTimespanWithFt(timespanId),
    ]);
    const where = this.buildAssignableVolunteersCondition(ftTimespan);
    const select = this.buildAssignableVolunteersSelection(
      ftTimespan,
      ftCategory,
    );

    const volunteers = await this.prisma.user.findMany({
      where,
      select,
      orderBy: { charisma: 'desc' },
    });
    return this.formatVolunteers(volunteers);
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
      this.assignmentService.buildVolunteerIsAvailableDuringPeriodCondition(
        ftTimespan,
      );

    const assignments =
      this.assignmentService.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(
        ftTimespan,
      );

    return {
      is_deleted: false,
      AND: [{ team }, { ...WHERE_VALIDATED_USER }],
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
        },
      },
    };
  }

  private formatVolunteers(volunteers: DatabaseVolunteer[]): Volunteer[] {
    return volunteers.map((volunteer) => this.formatVolunteer(volunteer));
  }

  private formatVolunteer(volunteer: DatabaseVolunteer): Volunteer {
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
    };
  }
}
