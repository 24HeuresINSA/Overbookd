import { Event } from "@overbookd/event";
import { Permission } from "@overbookd/permission";

export const PERMISSION_REVOKED = "permission-revoked" as const;

export type Team = string;
type RevokingPermission = { permission: Permission; from: Team };

export type PermissionRevoked = Event<
  typeof PERMISSION_REVOKED,
  RevokingPermission
>;

export type Teams = {
  as: (team: Team) => { revoke: (permission: Permission) => Promise<void> };
  is: (team: Team) => { ableTo: (permission: Permission) => Promise<boolean> };
};

export type Events = {
  publish(event: PermissionRevoked): void;
};

export class RevokePermission {
  constructor(
    private readonly teams: Teams,
    private readonly events: Events,
  ) {}

  async apply(request: RevokingPermission): Promise<void> {
    const { permission, from: team } = request;
    const hasPermission = await this.teams.is(team).ableTo(permission);
    if (!hasPermission) return;

    await this.teams.as(team).revoke(permission);
    this.events.publish({ type: PERMISSION_REVOKED, data: request });
  }
}
