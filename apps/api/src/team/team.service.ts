import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../src/prisma.service";
import { UserService } from "../../src/user/user.service";
import { SlugifyService } from "@overbookd/slugify";
import { Team, UpdateTeamForm } from "./team.model";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { MANAGE_ADMINS, VALIDATE_FA, VALIDATE_FT } from "@overbookd/permission";

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany({ orderBy: { name: "asc" } });
  }

  async findFaValidators(): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: { permissions: { some: { permissionName: VALIDATE_FA } } },
    });
  }

  async findFtValidators(): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: { permissions: { some: { permissionName: VALIDATE_FT } } },
    });
  }

  async createTeam(payload: Team): Promise<Team> {
    const code = SlugifyService.apply(payload.code ?? payload.name);
    return this.prisma.team.create({
      data: { ...payload, code },
    });
  }

  async updateTeam(code: string, payload: UpdateTeamForm): Promise<Team> {
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

  async addTeamsToUser(
    userId: number,
    teams: string[],
    author: JwtUtil,
  ): Promise<string[]> {
    await this.checkUserExistence(userId);
    if (!this.canManageTeams(teams, author)) {
      throw new UnauthorizedException("Tu ne peux pas gérer l'équipe admin");
    }

    const existingTeams = await this.fetchExistingTeams(teams);
    const userTeamLinks = existingTeams.map((teamCode) => {
      return { userId, teamCode };
    });

    const actions = userTeamLinks.map((link) => {
      return this.prisma.userTeam.upsert({
        where: {
          userId_teamCode: {
            userId: link.userId,
            teamCode: link.teamCode,
          },
        },
        create: link,
        update: {},
        select: { teamCode: true },
      });
    });

    const result = await this.prisma.$transaction(actions);
    return result.map((link) => link.teamCode);
  }

  async removeTeamFromUser(
    userId: number,
    team: string,
    author: JwtUtil,
  ): Promise<void> {
    await this.checkUserExistence(userId);
    if (!this.canManageTeams([team], author)) {
      throw new UnauthorizedException("Tu ne peux pas gérer l'équipe admin");
    }

    try {
      await this.prisma.userTeam.delete({
        where: {
          userId_teamCode: {
            userId,
            teamCode: team,
          },
        },
      });
    } catch (e) {
      this.logger.warn(`Try to remove ${team} unexisting team`);
    }
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

  static checkMembership(user: JwtUtil, team: string) {
    if (!user.isMemberOf(team)) {
      const notMember = `❌ Tu n'es pas membre de l'équipe ${team}`;
      throw new ForbiddenException(notMember);
    }
  }

  private async fetchExistingTeams(teams: string[]): Promise<string[]> {
    const teamsFound = await this.prisma.team.findMany({
      where: { code: { in: teams } },
      select: { code: true },
    });
    return teamsFound.map((team) => team.code);
  }

  private async checkUserExistence(id: number): Promise<void> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException("Utilisateur inconnu");
    }
  }

  private canManageTeams(teams: string[], author: JwtUtil) {
    return !teams.includes("admin") || author.can(MANAGE_ADMINS);
  }
}
