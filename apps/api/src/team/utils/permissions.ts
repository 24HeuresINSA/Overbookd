import { Team } from '@prisma/client';

export type TeamWithNestedPermissions = {
  team: Partial<Team> & {
    permissions: {
      permissionName: string;
    }[];
  };
};

export function retrievePermissions(
  teams: TeamWithNestedPermissions[],
): Set<string> {
  const permissions = teams.flatMap(({ team }) =>
    team.permissions.map(({ permissionName }) => permissionName),
  );
  return new Set(permissions);
}
