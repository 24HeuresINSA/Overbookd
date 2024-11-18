import { Event } from "@overbookd/event";
import {
  AFFECT_TEAM,
  Permission,
  READ_FA,
  READ_GEAR_CATALOG,
  READ_INVENTORY,
  WRITE_FA,
  WRITE_GEAR_CATALOG,
  WRITE_INVENTORY,
} from "@overbookd/permission";
import { beforeEach, describe, expect, it } from "vitest";
import {
  Team,
  RevokePermission,
  PERMISSION_REVOKED,
} from "./revoke-permission";
import { InMemoryTeams } from "./teams.inmemory";
import { InMemoryEvents } from "./events.inmemory";

let teams: InMemoryTeams;
let events: InMemoryEvents;
let revokePermission: RevokePermission;
const initialTeamPermissions = (): Map<Team, Permission[]> =>
  new Map([
    ["hard", [WRITE_FA, READ_FA, READ_GEAR_CATALOG, WRITE_GEAR_CATALOG]],
    ["soft", [READ_FA]],
    ["matos", [WRITE_INVENTORY, WRITE_GEAR_CATALOG, AFFECT_TEAM]],
  ]);

type TestHelper = { permission: Permission; team: Team };

describe("Revoke permission", () => {
  beforeEach(() => {
    events = new InMemoryEvents();
    teams = new InMemoryTeams(initialTeamPermissions());
    revokePermission = new RevokePermission(teams, events);
  });
  describe.each<TestHelper>([
    { permission: WRITE_FA, team: "hard" },
    { permission: WRITE_GEAR_CATALOG, team: "hard" },
    { permission: READ_FA, team: "soft" },
    { permission: AFFECT_TEAM, team: "matos" },
  ])(
    "when team $team had the permission $permission",
    ({ permission, team }) => {
      const revokingPermission = { permission, from: team };
      it("should apply without issue", async () => {
        expect(revokePermission.apply(revokingPermission)).resolves.ok;
      });
      it("should not have the permission anymore", async () => {
        await revokePermission.apply(revokingPermission);
        expect(teams.permissionsOf(team)).not.toContainEqual(permission);
      });
      it("should publish a permission revoked event", async () => {
        const expectedEvent = {
          type: PERMISSION_REVOKED,
          data: revokingPermission,
        };

        await revokePermission.apply(revokingPermission);

        expect(events.all).toHaveLength(1);
        expect(events.all).toContainEqual(expectedEvent);
      });
    },
  );
  describe("when a team does not have the permission", () => {
    const permission = WRITE_FA;
    const revokingPermission = { permission, from: "soft" } as const;
    it("should apply without issue", async () => {
      expect(revokePermission.apply(revokingPermission)).resolves.ok;
    });
    it("should not publish a permission revoked event", async () => {
      await revokePermission.apply(revokingPermission);

      expect(events.all).toHaveLength(0);
    });
  });
  describe("when the team does not exist", () => {
    const permission = WRITE_FA;
    const revokingPermission = { permission, from: "unknown" } as const;
    it("should apply without issue", async () => {
      expect(revokePermission.apply(revokingPermission)).resolves.ok;
    });
    it("should not publish a permission revoked event", async () => {
      await revokePermission.apply(revokingPermission);

      expect(events.all).toHaveLength(0);
    });
  });
});
