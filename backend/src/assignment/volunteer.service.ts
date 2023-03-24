import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TimespanWithFtResponseDto } from './dto/ftTimespanResponse.dto';
import { VolunteerResponseDto } from './dto/volunteerResponse.dto';
import { FtTimespanService } from './ftTimespan.service';
import {
  SELECT_VOLUNTEER,
  SELECT_VOLUNTEER_WITH_AVAILABILITIES,
  VolunteerAfterRequest,
  VolunteerWithAvailabilities,
} from './types/volunteerTypes';

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
              code: {
                in: ['hard', 'soft'],
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

  async findAllVolunteersWithAvailabilities(): Promise<
    VolunteerWithAvailabilities[]
  > {
    const volunteers = await this.prisma.user.findMany({
      where: {
        is_deleted: false,
        team: {
          some: {
            team: {
              code: {
                in: ['hard', 'soft'],
              },
            },
          },
        },
      },
      select: SELECT_VOLUNTEER_WITH_AVAILABILITIES,
      orderBy: {
        charisma: 'desc',
      },
    });
    return this.formatVolunteersWithAvailabilities(volunteers);
  }

  async findAvailableVolunteersForFtTimespan(
    id: number,
  ): Promise<VolunteerResponseDto[]> {
    const volunteers = await this.findAllVolunteersWithAvailabilities();

    const ftTimespan = await this.ftTimespan.findTimespanWithFt(id);
    const volunteersFilteredByTeams = this.filterVolunteersByRequestedTeams(
      volunteers,
      ftTimespan.requestedTeams,
    );
    const volunteersFilteredByAvailabilities =
      this.filterVolunteersByAvailabilitiesDuringFtTimespan(
        volunteersFilteredByTeams,
        ftTimespan,
      );

    return volunteersFilteredByAvailabilities.map((volunteer) => {
      const { availabilities, ...rest } = volunteer;
      return rest;
    });
  }

  private filterVolunteersByRequestedTeams(
    volunteers: VolunteerWithAvailabilities[],
    requestedTeams: string[],
  ): VolunteerWithAvailabilities[] {
    return volunteers.filter((volunteer) => {
      return volunteer.teams.some((team) => requestedTeams.includes(team));
    });
  }

  private filterVolunteersByAvailabilitiesDuringFtTimespan(
    volunteers: VolunteerWithAvailabilities[],
    ftTimespan: TimespanWithFtResponseDto,
  ): VolunteerWithAvailabilities[] {
    return volunteers.filter((volunteer) => {
      return this.ftTimespan.checkIfVolunteerIsAvailableDuringFtTimespan(
        volunteer.availabilities,
        ftTimespan,
      );
    });
  }

  private formatVolunteers(
    volunteers: VolunteerAfterRequest[],
  ): VolunteerResponseDto[] {
    return volunteers.map((volunteer) => this.formatVolunteer(volunteer));
  }

  private formatVolunteersWithAvailabilities(
    volunteers: VolunteerAfterRequest[],
  ): VolunteerWithAvailabilities[] {
    return volunteers.map((volunteer) => {
      return {
        ...this.formatVolunteer(volunteer),
        availabilities: volunteer.availabilities,
      };
    });
  }

  private formatVolunteer(
    volunteer: VolunteerAfterRequest,
  ): VolunteerResponseDto {
    return {
      id: volunteer.id,
      firstname: volunteer.firstname,
      lastname: volunteer.lastname,
      nickname: volunteer.nickname,
      comment: volunteer.comment,
      charisma: volunteer.charisma,
      teams: volunteer.team.map((t) => t.team.code),
    };
  }
}
