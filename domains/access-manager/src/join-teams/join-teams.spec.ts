import { beforeEach, describe, expect, it } from "vitest";
import {
  ADMIN,
  CONDUCTEUR,
  CONDUCTEUR_FEN,
  CONFIANCE,
  HARD,
  SOFT,
} from "@overbookd/team-code";
import { InMemoryEvents } from "./events.inmemory";
import {
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

let joinTeams: JoinTeams;
let events: InMemoryEvents;
let memberships: InMemoryMemberships;
const initialMembership = (): Map<Team, Member[]> =>
  new Map([
    [SOFT, [shogosse]],
    [HARD, [noel]],
    [CONFIANCE, []],
    [CONDUCTEUR, [noel]],
    [CONDUCTEUR_FEN, []],
    [ADMIN, [noel]],
  ]);

describe("Join teams", () => {
  beforeEach(() => {
    events = new InMemoryEvents();
    memberships = new InMemoryMemberships(initialMembership());
    joinTeams = new JoinTeams(memberships, events);
  });
  describe.each([
    { userName: shogosse.name, userId: shogosse.id, teams: [CONFIANCE] },
    { userName: shogosse.name, userId: shogosse.id, teams: [CONDUCTEUR] },
    {
      userName: shogosse.name,
      userId: shogosse.id,
      teams: [CONFIANCE, CONDUCTEUR],
    },
    { userName: noel.name, userId: noel.id, teams: [CONDUCTEUR_FEN] },
  ])(
    "when user $userName is not member of the teams $teams yet",
    ({ userId, userName, teams }) => {
      const member = { id: userId, name: userName };
      const joiningTeams = { member, teams };
      it("should apply without issue", async () => {
        expect(joinTeams.apply(joiningTeams)).resolves.ok;
      });
      it("should publish a teams joined event", async () => {
        const expectedEvent = { type: TEAMS_JOINED, data: joiningTeams };

        await joinTeams.apply(joiningTeams);

        expect(events.all).toHaveLength(1);
        expect(events.all).toContainEqual(expectedEvent);
      });
      it("should become member of the teams", async () => {
        await joinTeams.apply(joiningTeams);
        teams.every((team) =>
          expect(memberships.membersOf(team)).toContainEqual(member),
        );
      });
    },
  );
  describe("when user is already member of all the teams", () => {
    const joiningTeams = { member: shogosse, teams: [SOFT] };
    it("should apply without issue", async () => {
      expect(joinTeams.apply(joiningTeams)).resolves.ok;
    });
    it("should not publish a teams joined event", async () => {
      await joinTeams.apply(joiningTeams);

      expect(events.all).toHaveLength(0);
    });
    it("should stay member of the teams", async () => {
      await joinTeams.apply(joiningTeams);

      expect(memberships.membersOf(SOFT)).toContainEqual(shogosse);
    });
  });
  describe("when some of the teams do not exist", () => {
    it("should indicate that some of the teams do not exist", async () => {
      const joiningTeams = {
        member: shogosse,
        teams: ["unknown", "not existing", CONFIANCE],
      };
      await expect(joinTeams.apply(joiningTeams)).rejects.toThrow(
        new SomeTeamsNotFound(joiningTeams.teams),
      );
    });
  });
  describe("when user is joining admin team", () => {
    const joiningTeams = { member: shogosse, teams: [ADMIN] };
    it("should inidicate that admin team cannot be managed", async () => {
      await expect(joinTeams.apply(joiningTeams)).rejects.toThrow(
        AdminAssignmentError,
      );
    });
  });
});
