import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VolunteerResponse } from './dto/volunteerResponse';

const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
  charisma: true,
  comment: true,
  team: {
    select: {
      team: {
        select: {
          code: true,
        },
      },
    },
  },
};

@Injectable()
export class VolunteerService {
  constructor(private prisma: PrismaService) {}

  async findAllVolunteers(): Promise<VolunteerResponse[]> {
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
    });

    return volunteers.map(
      ({ id, firstname, lastname, nickname, charisma, comment, team }) => ({
        id,
        firstname,
        lastname,
        nickname,
        charisma,
        comment,
        teams: team.map((t) => t.team.code),
      }),
    );
  }
}
