import { Team } from '@prisma/client';

export type TeamWithNestedPermissions = {
  team: Partial<Team> & {
    permissions: {
      permission_name: string;
    }[];
  };
};

export function retrievePermissions(
  teams: TeamWithNestedPermissions[],
): Set<string> {
  const permissions = teams.flatMap(({ team }) =>
    team.permissions.map(({ permission_name }) => permission_name),
  );
  return new Set(permissions);
}
