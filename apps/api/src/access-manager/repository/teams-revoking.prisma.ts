import { TeamRevoking, TeamsRevoking } from "@overbookd/access-manager";
import { PrismaService } from "../../prisma.service";
import { Permission } from "@overbookd/permission";

export class PrismaTeamsRevoking implements TeamsRevoking {
  constructor(private prisma: PrismaService) {}

  as(team: TeamRevoking): {
    revoke: (permission: Permission) => Promise<void>;
  } {
    return {
      revoke: async (permission: Permission) => {
        await this.prisma.teamPermission.delete({
          where: unique({ team, permission }),
        });
      },
    };
  }

  is(team: TeamRevoking): {
    ableTo: (permission: Permission) => Promise<boolean>;
  } {
    return {
      ableTo: async (permission: Permission) => {
        const teamPermission = await this.prisma.teamPermission.findUnique({
          where: unique({ team, permission }),
        });
        return teamPermission !== null;
      },
    };
  }
}

function unique({ team, permission }: { team: string; permission: string }) {
  return {
    permissionName_teamCode: { teamCode: team, permissionName: permission },
  };
}
