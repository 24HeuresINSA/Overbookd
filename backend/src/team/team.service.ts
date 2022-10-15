import { Injectable } from '@nestjs/common';
import { Prisma, Team } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

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
  }): Promise<Partial<Team>[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    //get all users with their teams
    return this.prisma.team.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async updateUserTeams(payload: {
    userId: number;
    teams: string[];
  }): Promise<boolean> {
    const { userId, teams } = payload;
    // get user teams
    const user = await this.userService.user({ id: userId });
    if (!user.id) {
      return false;
    }
    //get all teams
    const allTeams = await this.prisma.team.findMany();
    //get all teams that are in the payload
    let teamsToLink = allTeams.filter((team) => teams.includes(team.name));
    teamsToLink = teamsToLink.filter((team) => !user.team.includes(team.name));

    const connect = this.prisma.user_Team.createMany({
      data: teamsToLink.map((team) => {
        return {
          team_id: team.name,
          user_id: userId,
        };
      }),
    });

    //get teams to unlink
    const teamsToUnlink = user.team.filter((team) => !teams.includes(team));
    //unlink teams
    const disconnect = this.prisma.user_Team.deleteMany({
      where: {
        team_id: {
          in: teamsToUnlink,
        },
        user_id: userId,
      },
    });

    await this.prisma.$transaction([connect, disconnect]);
    return true;
  }

  async createTeam(payload: { name: string }): Promise<boolean> {
    const { name } = payload;
    const team = await this.prisma.team.create({
      data: {
        name,
      },
    });
    return !!team;
  }

  async deleteTeam(payload: { name: string }): Promise<boolean> {
    const { name } = payload;
    const team = await this.prisma.team.delete({
      where: {
        name,
      },
    });
    return !!team;
  }
}
