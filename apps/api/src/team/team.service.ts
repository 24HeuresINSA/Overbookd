import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JoinTeams, LeaveTeam } from "@overbookd/access-manager";
import { MANAGE_ADMINS, VALIDATE_FA, VALIDATE_FT } from "@overbookd/permission";
import { ADMIN } from "@overbookd/team-constants";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "@overbookd/team";
import { toStandAloneUser } from "@overbookd/user";
import { PrismaService } from "../../src/prisma.service";
import { UserService } from "../../src/user/user.service";
import {
  SELECT_TEAM_CODES,
  SELECT_USER_IDENTIFIER,
} from "../common/query/user.query";
import { canManageAdmins } from "./team.utils";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

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

  async findFaReviewers(): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: { permissions: { some: { permissionName: VALIDATE_FA } } },
    });
  }

  async findFtReviewers(): Promise<Team[]> {
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
    if (code === ADMIN) {
      throw new UnauthorizedException("Touche pas à l'équipe admin !");
    }
    await this.prisma.team.delete({ where: { code } });
  }

  as(me: RequestHydratedUser) {
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
      select: SELECT_TEAM_CODES,
    });
    return user.teams.map((t) => t.teamCode);
  }

  async removeTeamFromUser(
    userId: number,
    team: string,
    author: RequestHydratedUser,
  ): Promise<void> {
    await this.checkUserExistence(userId);
    if (!canManageAdmins([team], author)) {
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
}
