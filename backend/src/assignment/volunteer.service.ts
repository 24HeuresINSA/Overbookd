import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getOtherAssignableTeams } from 'src/team/underlyingTeams.utils';
import { TimespanWithFtResponseDto } from './dto/ftTimespanResponse.dto';
import { VolunteerResponseDto } from './dto/volunteerResponse.dto';
import { FtTimespanService } from './ftTimespan.service';
import { DatabaseVolunteer, SELECT_VOLUNTEER } from './types/volunteerTypes';
import { TaskCategory } from '@prisma/client';

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

@Injectable()
export class VolunteerService {
  constructor(
    private prisma: PrismaService,
    private ftTimespan: FtTimespanService,
  ) {}

  async findAllVolunteers(): Promise<VolunteerResponseDto[]> {
    const volunteers = await this.prisma.user.findMany({
      where: {
        is_deleted: false,
        ...WHERE_VALIDATED_USER,
      },
      select: SELECT_VOLUNTEER,
      orderBy: { charisma: 'desc' },
    });
    return this.formatVolunteers(volunteers);
  }

  async findAvailableVolunteersForFtTimespan(
    timespanId: number,
  ): Promise<VolunteerResponseDto[]> {
    const [ftCategory, ftTimespan] = await Promise.all([
      this.ftTimespan.getCategoryByTimespan(timespanId),
      this.ftTimespan.findTimespanWithFt(timespanId),
    ]);
    const where = this.buildAssignableVolunteersCondition(ftTimespan);
    const select =
      this.buildAssignableVolunteersWithCategoryTaskCountSelection(ftCategory);

    const volunteers = await this.prisma.user.findMany({
      where,
      select,
      orderBy: { charisma: 'desc' },
    });
    console.log(volunteers[0]._count.assignments);
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
    const availabilities = this.buildAvailableVolunteersCondition(ftTimespan);

    return {
      is_deleted: false,
      AND: [{ team }, { ...WHERE_VALIDATED_USER }],
      availabilities,
    };
  }

  private buildAvailableVolunteersCondition(
    ftTimespan: TimespanWithFtResponseDto,
  ) {
    return {
      some: {
        start: {
          lte: ftTimespan.start,
        },
        end: {
          gte: ftTimespan.end,
        },
      },
    };
  }

  private buildAssignableVolunteersWithCategoryTaskCountSelection(
    category: TaskCategory,
  ) {
    return {
      ...SELECT_VOLUNTEER,
      _count: {
        select: {
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

  private formatVolunteers(
    volunteers: DatabaseVolunteer[],
  ): VolunteerResponseDto[] {
    return volunteers.map((volunteer) => this.formatVolunteer(volunteer));
  }

  private formatVolunteer(volunteer: DatabaseVolunteer): VolunteerResponseDto {
    const formattedVolunteer = {
      id: volunteer.id,
      firstname: volunteer.firstname,
      lastname: volunteer.lastname,
      comment: volunteer.comment,
      charisma: volunteer.charisma,
      teams: volunteer.team.map((t) => t.team.code),
    };

    if (volunteer?._count) {
      return {
        ...formattedVolunteer,
        categoryTaskCount: volunteer._count.assignments,
      };
    }
    return formattedVolunteer;
  }
}
