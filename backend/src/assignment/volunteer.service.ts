import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VolunteerResponseDto } from './dto/volunteerResponse.dto';
import { FtTimespanService } from './ftTimespan.service';
import { DatabaseVolunteer, SELECT_VOLUNTEER } from './types/volunteerTypes';

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
      },
      select: SELECT_VOLUNTEER,
      orderBy: {
        charisma: 'desc',
      },
    });
    return this.formatVolunteers(volunteers);
  }

  async findAvailableVolunteersForFtTimespan(
    timespanId: number,
  ): Promise<VolunteerResponseDto[]> {
    const ftTimespan = await this.ftTimespan.findTimespanWithFt(timespanId);
    const volunteers = await this.prisma.user.findMany({
      where: {
        is_deleted: false,
        AND: [
          {
            team: {
              some: {
                team: {
                  code: {
                    in: ftTimespan.requestedTeams,
                  },
                },
              },
            },
          },
          {
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
          },
        ],
        availabilities: {
          some: {
            start: {
              lte: ftTimespan.end,
              gte: ftTimespan.start,
            },
            end: {
              lte: ftTimespan.end,
              gte: ftTimespan.start,
            },
          },
        },
      },
      select: SELECT_VOLUNTEER,
      orderBy: {
        charisma: 'desc',
      },
    });
    return this.formatVolunteers(volunteers);
  }

  private formatVolunteers(
    volunteers: DatabaseVolunteer[],
  ): VolunteerResponseDto[] {
    return volunteers.map((volunteer) => this.formatVolunteer(volunteer));
  }

  private formatVolunteer(volunteer: DatabaseVolunteer): VolunteerResponseDto {
    return {
      id: volunteer.id,
      firstname: volunteer.firstname,
      lastname: volunteer.lastname,
      comment: volunteer.comment,
      charisma: volunteer.charisma,
      teams: volunteer.team.map((t) => t.team.code),
    };
  }
}
