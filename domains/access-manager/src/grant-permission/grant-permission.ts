import type { Permission } from "@overbookd/permission";
import type { Event } from "@overbookd/event";
import { TeamNotFound } from "../access-manager.error";

export type Team = {
  code: string;
  permissions: Permission[];
};

export type Grant = {
  permission: Permission;
  to: string;
};

export type Teams = {
  find(code: Team["code"]): Promise<Team | undefined>;
  save(team: Team): Promise<Team>;
};

export const PERMISSION_GRANTED = "permission-granted" as const;

export type PermissionGranted = Event<typeof PERMISSION_GRANTED, Grant>;

export type Events = {
  publish(event: PermissionGranted): void;
};

export class GrantPermission {
  constructor(
    private readonly teams: Teams,
    private readonly events: Events,
  ) {}

  async apply({ to, permission }: Grant): Promise<Team> {
    const team = await this.teams.find(to);
    if (!team) throw new TeamNotFound(to);
    if (team.permissions.includes(permission)) return team;

    const permissions = [...team.permissions, permission];
    const saved = await this.teams.save({ code: team.code, permissions });
    this.events.publish({ type: PERMISSION_GRANTED, data: { to, permission } });

    return saved;
  }
}
