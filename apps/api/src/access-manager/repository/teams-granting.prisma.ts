import type { TeamsGranting, TeamGranting } from "@overbookd/access-manager";
import { isPermission } from "@overbookd/permission";
import { PrismaService } from "../../prisma.service";

const SELECT_TEAM = {
  code: true,
  permissions: { select: { permissionName: true } },
};

export class PrismaTeamsGranting implements TeamsGranting {
  constructor(private prisma: PrismaService) {}

  async find(code: TeamGranting["code"]): Promise<TeamGranting | undefined> {
    const team = await this.prisma.team.findUnique({
      where: { code },
      select: SELECT_TEAM,
    });
    if (!team) return undefined;
    const permissions = retrievePermissions(team);
    return { ...team, permissions };
  }

  async save(team: TeamGranting): Promise<TeamGranting> {
    const permissionTeamTuples = team.permissions.map((permission) => ({
      permissionName: permission,
      teamCode: team.code,
    }));
    await this.prisma.teamPermission.createMany({
      data: permissionTeamTuples,
      skipDuplicates: true,
    });
    return team;
  }
}

type DatabaseTeam = {
  code: string;
  permissions: {
    permissionName: string;
  }[];
};

function retrievePermissions(team: DatabaseTeam) {
  return team.permissions
    .map(({ permissionName }) => permissionName)
    .filter(isPermission);
}
