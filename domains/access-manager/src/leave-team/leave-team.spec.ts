import { beforeEach, describe, expect, it } from "vitest";
import { ADMIN } from "../admin.constant";
import { InMemoryEvents } from "./events.inmemory";
import {
  AdminUnassignmentError,
  LeaveTeam,
  Member,
  Team,
  TEAM_LEFT,
} from "./leave-team";
import { InMemoryMemberships } from "./memberships.inmemory";
import { BENEVOLE_FESTIVAL_CODE, HARD_CODE } from "@overbookd/team-constants";

const shogosse = { id: 1, name: "Lea (Shogosse) Mauyno" };
const noel = { id: 2, name: "Noel Ertsemud" };

const adminManager = { canManageAdmins: true };
const standardUser = { canManageAdmins: false };

let leaveTeam: LeaveTeam;
let events: InMemoryEvents;
let memberships: InMemoryMemberships;
const initialMembership = (): Map<Team, Member[]> =>
  new Map([
    [BENEVOLE_FESTIVAL_CODE, [shogosse]],
    ["confiance", []],
    ["conducteur", [noel]],
    ["conducteur FEN", []],
    [HARD_CODE, [noel]],
    [ADMIN, [noel]],
  ]);

describe("Leave team", () => {
  beforeEach(() => {
    events = new InMemoryEvents();
    memberships = new InMemoryMemberships(initialMembership());
    leaveTeam = new LeaveTeam(memberships, events);
  });
  describe.each([
    {
      userName: shogosse.name,
      userId: shogosse.id,
      team: BENEVOLE_FESTIVAL_CODE,
    },
    { userName: noel.name, userId: noel.id, team: HARD_CODE },
    { userName: noel.name, userId: noel.id, team: "conducteur" },
  ])(
    "when user $username is member of the team $team",
    ({ userName, userId, team }) => {
      const member = { id: userId, name: userName };
      const leavingTeam = { member, team };
      const request = { ...leavingTeam, teamManager: standardUser };
      it("should apply without issue", async () => {
        expect(leaveTeam.apply(request)).resolves.ok;
      });
      it("should publish a team left event", async () => {
        const expectedEvent = { type: TEAM_LEFT, data: leavingTeam };

        await leaveTeam.apply(request);

        expect(events.all).toHaveLength(1);
        expect(events.all).toContainEqual(expectedEvent);
      });
      it("should not be member of the team anymore", async () => {
        const { member, team } = leavingTeam;
        await leaveTeam.apply(request);
        expect(memberships.membersOf(team)).not.toContainEqual(member);
      });
    },
  );
  describe("when user is not member of the team", () => {
    const leavingTeam = { member: shogosse, team: "confiance" };
    const request = { ...leavingTeam, teamManager: standardUser };
    it("should apply without issue", async () => {
      expect(leaveTeam.apply(request)).resolves.ok;
    });
    it("should not publish a team left event", async () => {
      await leaveTeam.apply(request);

      expect(events.all).toHaveLength(0);
    });
  });
  describe("when the team does not exist", () => {
    const leavingTeam = { member: shogosse, team: "unknown" };
    const request = { ...leavingTeam, teamManager: standardUser };
    it("should apply without issue", async () => {
      expect(leaveTeam.apply(request)).resolves.ok;
    });
    it("should not publish a team left event", async () => {
      await leaveTeam.apply(request);

      expect(events.all).toHaveLength(0);
    });
  });
  describe("when user is leaving admin team", () => {
    const leavingTeam = { member: noel, team: ADMIN };
    describe("when team manager can not manage admins", () => {
      const request = { ...leavingTeam, teamManager: standardUser };
      it("should inidicate that team manager cannot manage admins", async () => {
        await expect(leaveTeam.apply(request)).rejects.toThrowError(
          AdminUnassignmentError,
        );
      });
    });
    describe("when team manager can manage admins", () => {
      const request = { ...leavingTeam, teamManager: adminManager };
      it("should apply without issue", async () => {
        expect(leaveTeam.apply(request)).resolves.ok;
      });
      it("should publish a team left event", async () => {
        const expectedEvent = { type: TEAM_LEFT, data: leavingTeam };

        await leaveTeam.apply(request);

        expect(events.all).toHaveLength(1);
        expect(events.all).toContainEqual(expectedEvent);
      });
      it("should not be member of the team anymore", async () => {
        const { member, team } = leavingTeam;
        await leaveTeam.apply(request);
        expect(memberships.membersOf(team)).not.toContainEqual(member);
      });
    });
  });
});
