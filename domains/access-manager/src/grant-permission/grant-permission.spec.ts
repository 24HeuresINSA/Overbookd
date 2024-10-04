import { beforeEach, describe, expect, it } from "vitest";
import { READ_FA, WRITE_FA } from "@overbookd/permission";
import { InMemoryTeams } from "./teams.inmemory";
import {
  Team,
  GrantPermission,
  Grant,
  TeamNotFound,
  PERMISSION_GRANTED,
} from "./grant-permission";
import { InMemoryEvents } from "./events.inmemory";

const hard: Team = { code: "hard", permissions: [READ_FA] };
let teams: InMemoryTeams;
let events: InMemoryEvents;
let grantPermission: GrantPermission;

describe("Grant permission", () => {
  beforeEach(() => {
    teams = new InMemoryTeams([hard]);
    events = new InMemoryEvents();
    grantPermission = new GrantPermission(teams, events);
  });
  describe("when a team does not have the permission yet", () => {
    const grant: Grant = { permission: WRITE_FA, to: hard.code };
    it("should add the permission to the team", async () => {
      const expectedPermission = [...hard.permissions, WRITE_FA];
      const expected = { ...hard, permissions: expectedPermission };

      const res = await grantPermission.apply(grant);

      expect(res.permissions).toContain(WRITE_FA);
      expect(res).toStrictEqual(expected);
      expect(teams.all).toContainEqual(expected);
    });
    it("should publish a permission granted event", async () => {
      const expectedEvent = { type: PERMISSION_GRANTED, data: grant };

      await grantPermission.apply(grant);

      expect(events.all).toHaveLength(1);
      expect(events.all).toContainEqual(expectedEvent);
    });
  });
  describe("when a team already has the permission", () => {
    const grant: Grant = { permission: READ_FA, to: hard.code };
    it("should keep team's current permissions", async () => {
      const expected = hard;

      const res = await grantPermission.apply(grant);

      expect(res.permissions).toContain(READ_FA);
      expect(res).toStrictEqual(expected);
      expect(teams.all).toContainEqual(expected);
    });
    it("should not publish a permission granted event", async () => {
      await grantPermission.apply(grant);

      expect(events.all).toHaveLength(0);
    });
  });
  describe("when the team does not exist", () => {
    it("should throw an error", async () => {
      const grant: Grant = { permission: WRITE_FA, to: "unknown" };
      await expect(() => grantPermission.apply(grant)).rejects.toThrowError(
        new TeamNotFound("unknown"),
      );
    });
  });
});
