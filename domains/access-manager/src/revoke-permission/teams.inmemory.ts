import { Permission } from "@overbookd/permission";
import { Teams, Team } from "./revoke-permission";

export class InMemoryTeams implements Teams {
  constructor(private teamPermissions: Map<Team, Permission[]> = new Map()) { }

  as(team: Team): { revoke: (permission: Permission) => Promise<void>; } {
    return {
      revoke: async (permission: Permission) => {
        const permissions = this.teamPermissions.get(team) ?? [];
        const withoutPermission = permissions.filter(
          (current) => current !== permission
        );
        this.teamPermissions.set(team, withoutPermission);
      },
    };
  }

  is(team: Team): { ableTo: (permission: Permission) => Promise<boolean>; } {
    return {
      ableTo: async (permission: Permission) => {
        return this.teamPermissions.get(team)?.includes(permission) ?? false;
      },
    };
  }

  permissionsOf(team: Team): Permission[] {
    return this.teamPermissions.get(team) ?? [];
  }
}
