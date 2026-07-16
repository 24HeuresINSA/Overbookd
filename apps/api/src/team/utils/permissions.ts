import { isPermission, Permission } from "@overbookd/permission";

export type TeamWithNestedPermissions = {
  team: {
    code: string;
    permissions: {
      permissionName: string;
    }[];
  };
};

export function retrievePermissions(
  teams: TeamWithNestedPermissions[],
): Permission[] {
  const permissions = teams
    .flatMap(({ team }) =>
      team.permissions.map(({ permissionName }) => permissionName),
    )
    .filter(isPermission);
  return [...new Set(permissions)];
}
