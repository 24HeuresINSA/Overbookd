import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryEvents } from "./events.inmemory";
import {
  ADMIN,
  AdminAssignmentError,
  JoinTeams,
  Member,
  SomeTeamsNotFound,
  Team,
  TEAMS_JOINED,
} from "./join-teams";
import { InMemoryMemberships } from "./memberships.inmemory";

const shogosse = { id: 1, name: "Lea (Shogosse) Mauyno" };
const noel = { id: 2, name: "Noel Ertsemud" };

const adminManager = { canManageAdmins: true };
const standardUser = { canManageAdmins: false };

let joinTeams: JoinTeams;
let events: InMemoryEvents;
let memberships: InMemoryMemberships;
const initialMembership = (): Map<Team, Member[]> =>
  new Map([
    ["soft", [shogosse]],
    ["hard", [noel]],
    ["confiance", []],
    ["conducteur", [noel]],
    ["conducteur FEN", []],
    [ADMIN, [noel]],
  ]);

describe("Join teams", () => {
  beforeEach(() => {
    events = new InMemoryEvents();
    memberships = new InMemoryMemberships(initialMembership());
    joinTeams = new JoinTeams(memberships, events);
  });
  describe.each([
    { userName: shogosse.name, userId: shogosse.id, teams: ["confiance"] },
    { userName: shogosse.name, userId: shogosse.id, teams: ["conducteur"] },
    {
      userName: shogosse.name,
      userId: shogosse.id,
      teams: ["confiance", "conducteur"],
    },
    { userName: noel.name, userId: noel.id, teams: ["conducteur FEN"] },
  ])(
    "when user $userName is not member of the teams $teams yet",
    ({ userId, userName, teams }) => {
      const member = { id: userId, name: userName };
      const joiningTeams = { member, teams };
      const request = { ...joiningTeams, teamManager: standardUser };
      it("should apply without issue", async () => {
        expect(joinTeams.apply(request)).resolves.ok;
      });
      it("should publish a teams joined event", async () => {
        const expectedEvent = { type: TEAMS_JOINED, data: joiningTeams };

        await joinTeams.apply(request);

        expect(events.all).toHaveLength(1);
        expect(events.all).toContainEqual(expectedEvent);
      });
      it("should become member of the teams", async () => {
        await joinTeams.apply(request);
        teams.every((team) =>
          expect(memberships.membersOf(team)).toContainEqual(member),
        );
      });
    },
  );
  describe("when user is already member of all the teams", () => {
    const request = {
      member: shogosse,
      teams: ["soft"],
      teamManager: standardUser,
    };
    it("should apply without issue", async () => {
      expect(joinTeams.apply(request)).resolves.ok;
    });
    it("should not publish a teams joined event", async () => {
      await joinTeams.apply(request);

      expect(events.all).toHaveLength(0);
    });
    it("should stay member of the teams", async () => {
      await joinTeams.apply(request);

      expect(memberships.membersOf("soft")).toContainEqual(shogosse);
    });
  });
  describe("when some of the teams do not exist", () => {
    it("should indicate that some of the teams do not exist", async () => {
      const request = {
        member: shogosse,
        teams: ["unknown", "not existing", "confiance"],
        teamManager: standardUser,
      };
      await expect(joinTeams.apply(request)).rejects.toThrowError(
        new SomeTeamsNotFound(request.teams),
      );
    });
  });
  describe("when user is joining admin team", () => {
    const joiningTeams = { member: shogosse, teams: [ADMIN] };
    describe("when team manager can not manage admins", () => {
      const request = { ...joiningTeams, teamManager: standardUser };
      it("should inidicate that team manager cannot manage admins", async () => {
        await expect(joinTeams.apply(request)).rejects.toThrowError(
          AdminAssignmentError,
        );
      });
    });
    describe("when team manager can manage admins", () => {
      const request = { ...joiningTeams, teamManager: adminManager };
      it("should apply without issue", async () => {
        expect(joinTeams.apply(request)).resolves.ok;
      });
      it("should publish a teams joined event", async () => {
        const expectedEvent = { type: TEAMS_JOINED, data: joiningTeams };

        await joinTeams.apply(request);

        expect(events.all).toHaveLength(1);
        expect(events.all).toContainEqual(expectedEvent);
      });
      it("should become member of the teams", async () => {
        await joinTeams.apply(request);
        expect(memberships.membersOf(ADMIN)).toContainEqual(shogosse);
      });
    });
  });
});
