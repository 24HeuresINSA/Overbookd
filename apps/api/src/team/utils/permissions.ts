import { Permission } from "@overbookd/permission";

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
): Set<Permission> {
  const permissions = teams.flatMap(({ team }) =>
    team.permissions.map(({ permissionName }) => permissionName as Permission),
  );
  return new Set(permissions);
}
