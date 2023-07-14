import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Team } from '@prisma/client';
import { SlugifyService } from '../common/services/slugify.service';
import { PrismaService } from '../../src/prisma.service';
import { UserService } from '../../src/user/user.service';
import { LinkTeamToUserDto } from './dto/linkTeamUser.dto';

export const TEAM_SELECT = {
  select: {
    id: true,
    name: true,
    code: true,
    color: true,
    icon: true,
  },
};

@Injectable()
export class TeamService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private slugifyService: SlugifyService,
  ) {}

  async team(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TeamWhereUniqueInput;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput;
    include?: Prisma.TeamInclude;
  }): Promise<Team[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.team.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async updateUserTeams({
    userId,
    teams,
  }: LinkTeamToUserDto): Promise<LinkTeamToUserDto> {
    await this.checkUserExistence(userId);
    const teamsToLink = await this.fetchExistingTeams(teams);
    await this.forceUserTeams(userId, teamsToLink);

    const newLinkedTeams = teamsToLink.map((team) => team.code);
    return { userId, teams: newLinkedTeams };
  }

  async createTeam(payload: {
    name: string;
    code?: string;
    color?: string;
    icon?: string;
  }): Promise<Team> {
    const code = this.slugifyService.slugify(payload.code ?? payload.name);
    return this.prisma.team.create({
      data: { ...payload, code },
    });
  }

  async updateTeam(
    id: number,
    payload: {
      name?: string;
      color?: string;
      icon?: string;
    },
  ): Promise<Team> {
    return this.prisma.team.update({
      where: { id },
      data: payload,
    });
  }

  async deleteTeam(id: number): Promise<void> {
    await this.prisma.team.delete({
      where: { id },
    });
    return;
  }

  static buildIsMemberOfCondition(teamCodes: string[]) {
    return {
      some: {
        team: {
          code: { in: teamCodes },
        },
      },
    };
  }

  private async forceUserTeams(userId: number, teamsToLink: Team[]) {
    const deleteAll = this.prisma.userTeam.deleteMany({
      where: { userId },
    });

    const createNew = this.prisma.userTeam.createMany({
      data: teamsToLink.map((team) => ({
        userId,
        teamId: team.id,
      })),
    });

    return this.prisma.$transaction([deleteAll, createNew]);
  }

  private async fetchExistingTeams(teams: string[]): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: {
        code: { in: teams },
      },
    });
  }

  private async checkUserExistence(id: number): Promise<void> {
    const user = await this.userService.getById(id);
    if (!user.id) {
      throw new NotFoundException('User not found');
    }
  }
}
