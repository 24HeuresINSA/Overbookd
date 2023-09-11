import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../src/prisma.service";
import { UserService } from "../../src/user/user.service";
import { LinkTeamToUserDto } from "./dto/link-team-user.dto";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "./team.model";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";

export const TEAM_SELECT = {
  select: {
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

  async updateUserTeams(
    { userId, teams }: LinkTeamToUserDto,
    author: JwtUtil,
  ): Promise<LinkTeamToUserDto> {
    await this.checkUserExistence(userId);
    const linkableTeams = this.cleanAdminTeamIfNotAdmin(teams, author);
    const teamsToLink = await this.fetchExistingTeams(linkableTeams);
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
    const code = SlugifyService.apply(payload.code ?? payload.name);
    return this.prisma.team.create({
      data: { ...payload, code },
    });
  }

  async updateTeam(
    code: string,
    payload: {
      name?: string;
      color?: string;
      icon?: string;
    },
  ): Promise<Team> {
    return this.prisma.team.update({
      where: { code },
      data: payload,
    });
  }

  async deleteTeam(code: string): Promise<void> {
    await this.prisma.team.delete({
      where: { code },
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
        teamCode: team.code,
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
      throw new NotFoundException("User not found");
    }
  }

  private cleanAdminTeamIfNotAdmin(teams: string[], author: JwtUtil) {
    if (!author.can("manage-admins")) {
      return teams.filter((team) => team !== "admin");
    }
    if (teams.length === 0) {
      throw new UnauthorizedException("Tu ne peux pas gérer l'équipe admin");
    }

    return teams;
  }
}
