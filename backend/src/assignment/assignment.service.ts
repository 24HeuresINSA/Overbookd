import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TEAM_SELECT } from 'src/team/team.service';
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
      team: TEAM_SELECT,
    },
  },
};

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<VolunteerResponse[]> {
    const volunteers = await this.prisma.user.findMany({
      where: {
        is_deleted: false,
      },
      select: SELECT_VOLUNTEER,
    });

    return volunteers.map((v) => {
      const teams = v.team.map((t) => t.team);
      return { ...v, teams };
    });
  }
}
