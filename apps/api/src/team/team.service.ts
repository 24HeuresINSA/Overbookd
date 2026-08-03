import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JoinTeams, LeaveTeam } from "@overbookd/access-manager";
import { VALIDATE_FA, VALIDATE_FT } from "@overbookd/permission";
import { ADMIN } from "@overbookd/team-constants";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "@overbookd/team";
import { toStandAloneUser } from "@overbookd/user";
import { PrismaService } from "../../src/prisma.service";
import {
  SELECT_TEAM_CODES,
  SELECT_USER_IDENTIFIER,
} from "../common/query/user.query";

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

  user(userId: number) {
    return {
      joins: async (teams: string[]) => {
        const member = await this.generateMember(userId);
        await this.joinTeams.apply({ member, teams });
        return this.listTeamsFor(userId);
      },
      leave: async (team: string) => {
        const member = await this.generateMember(userId);
        return this.leaveTeam.apply({ member, team });
      },
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

  static buildIsMemberOfCondition(teamCodes: string[]) {
    return { some: { team: { code: { in: teamCodes } } } };
  }
}
