import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JoinTeams, LeaveTeam } from "@overbookd/access-manager";
import { MANAGE_ADMINS, VALIDATE_FA, VALIDATE_FT } from "@overbookd/permission";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "@overbookd/team";
import { PrismaService } from "../../src/prisma.service";
import { UserService } from "../../src/user/user.service";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import {
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../common/query/user.query";
import { toStandAloneUser } from "../user/to-stand-alone-user";

export type UpdateTeamForm = {
  name?: string;
  color?: string;
  icon?: string;
};

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private readonly joinTeams: JoinTeams,
    private readonly leaveTeam: LeaveTeam,
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
    await this.prisma.team.delete({ where: { code } });
  }

  as(me: JwtUtil) {
    return {
      user: (userId: number) => ({
        joins: async (teams: string[]) => {
          const member = await this.generateMember(userId);
          const teamManager = { canManageAdmins: me.can(MANAGE_ADMINS) };
          await this.joinTeams.apply({ member, teams, teamManager });
          return this.listTeamsFor(userId);
        },
        leave: async (team: string) => {
          const member = await this.generateMember(userId);
          const teamManager = { canManageAdmins: me.can(MANAGE_ADMINS) };
          return this.leaveTeam.apply({ member, team, teamManager });
        },
      }),
    };
  }

  private async generateMember(userId: number) {
    const member = await this.prisma.user.findUnique({
      where: { id: userId },
      select: SELECT_USER_IDENTIFIER,
    });
    if (member === null) throw new NotFoundException("Utilisateur inconnu");

    return toStandAloneUser(member);
  }

  private async listTeamsFor(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: SELECT_TEAMS_CODE,
    });
    return user.teams.map((t) => t.teamCode);
  }

  async removeTeamFromUser(
    userId: number,
    team: string,
    author: JwtUtil,
  ): Promise<void> {
    await this.checkUserExistence(userId);
    if (!this.canManageAdmins([team], author)) {
      throw new UnauthorizedException("Tu ne peux pas gérer l'équipe admin");
    }

    try {
      await this.prisma.userTeam.delete({
        where: { userId_teamCode: { userId, teamCode: team } },
      });
    } catch (_error) {
      this.logger.warn(`Try to remove ${team} unexisting team`);
    }
  }

  static buildIsMemberOfCondition(teamCodes: string[]) {
    return { some: { team: { code: { in: teamCodes } } } };
  }

  static checkMembership(user: JwtUtil, team: string) {
    if (!user.isMemberOf(team)) {
      const notMember = `Tu n'es pas membre de l'équipe ${team}`;
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
    if (!user) throw new NotFoundException("Utilisateur inconnu");
  }

  private canManageAdmins(teams: string[], author: JwtUtil) {
    return !teams.includes("admin") || author.can(MANAGE_ADMINS);
  }
}
