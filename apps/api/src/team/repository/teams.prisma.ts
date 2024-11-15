import type { Teams, Team } from "@overbookd/access-manager";
import { isPermission } from "@overbookd/permission";
import { PrismaService } from "../../prisma.service";

const SELECT_TEAM = {
  code: true,
  permissions: { select: { permissionName: true } },
};

export class PrismaTeams implements Teams {
  constructor(private prisma: PrismaService) {}

  async find(code: Team["code"]): Promise<Team | undefined> {
    const team = await this.prisma.team.findUnique({
      where: { code },
      select: SELECT_TEAM,
    });
    if (!team) return undefined;
    const permissions = retrievePermissions(team);
    return { ...team, permissions };
  }

  async save(team: Team): Promise<Team> {
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
