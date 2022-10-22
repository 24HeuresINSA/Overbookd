import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Team } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { LinkTeamToUserDto } from './dto/linkTeamUser.dto';

@Injectable()
export class TeamService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async team(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TeamWhereUniqueInput;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput;
    select?: Prisma.TeamSelect;
    include?: Prisma.TeamInclude;
  }): Promise<string[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    const teams = await this.prisma.team.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
    return teams.map((team) => team.name);
  }

  async updateUserTeams(
    payload: LinkTeamToUserDto,
  ): Promise<LinkTeamToUserDto> {
    // Verify user exists
    const user = await this.userService.user({ id: payload.userId });
    if (!user.id) {
      throw new NotFoundException('User not found');
    }
    // Take only the teams that exist
    const teamsToLink = await this.prisma.team.findMany({
      where: {
        name: {
          in: payload.teams,
        },
      },
    });

    const deleteAll = this.prisma.user_Team.deleteMany({
      where: {
        user_id: payload.userId,
      },
    });

    const createNew = this.prisma.user_Team.createMany({
      data: teamsToLink.map((team) => ({
        user_id: payload.userId,
        team_id: team.name,
      })),
    });

    await this.prisma.$transaction([deleteAll, createNew]);
    payload.teams = teamsToLink.map((team) => team.name);
    return payload;
  }

  async createTeam(payload: { name: string }): Promise<Team> {
    const { name } = payload;
    const team = await this.prisma.team.create({
      data: {
        name,
      },
    });
    return team;
  }

  async deleteTeam(payload: { name: string }): Promise<void> {
    const { name } = payload;
    await this.prisma.team.delete({
      where: {
        name,
      },
    });
    return;
  }
}
