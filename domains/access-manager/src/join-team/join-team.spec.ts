import { beforeEach, describe, expect, it } from "vitest";
import { TeamNotFound } from "../access-manager.error";
import { InMemoryEvents } from "./events.inmemory";
import { JoinTeam, Member, Team, TEAM_JOINED } from "./join-team";
import { InMemoryMemberships } from "./memberships.inmemory";

const shogosse = { id: 1, name: "Lea (Shogosse) Mauyno" };
const noel = { id: 2, name: "Noel Ertsemud" };

let joinTeam: JoinTeam;
let events: InMemoryEvents;
let memberships: InMemoryMemberships;
const initialMembership = (): Map<Team, Member[]> =>
  new Map([
    ["soft", [shogosse]],
    ["hard", [noel]],
    ["confiance", []],
    ["conducteur", [noel]],
    ["conducteur FEN", []],
  ]);

describe("Join team", () => {
  beforeEach(() => {
    events = new InMemoryEvents();
    memberships = new InMemoryMemberships(initialMembership());
    joinTeam = new JoinTeam(memberships, events);
  });
  describe.each([
    { userName: shogosse.name, userId: shogosse.id, team: "confiance" },
    { userName: shogosse.name, userId: shogosse.id, team: "conducteur" },
    { userName: noel.name, userId: noel.id, team: "conducteur FEN" },
  ])(
    "when user $userName is not member of the team $team yet",
    ({ userId, userName, team }) => {
      const member = { id: userId, name: userName };
      const joiningTeam = { member, team };
      it("should apply without issue", async () => {
        expect(joinTeam.apply(joiningTeam)).resolves.ok;
      });
      it("should publish a team joined event", async () => {
        const expectedEvent = { type: TEAM_JOINED, data: joiningTeam };

        await joinTeam.apply(joiningTeam);

        expect(events.all).toHaveLength(1);
        expect(events.all).toContainEqual(expectedEvent);
      });
      it("should become member of the team", async () => {
        await joinTeam.apply(joiningTeam);

        expect(memberships.membersOf(team)).toContainEqual(member);
      });
    },
  );
  describe("when user is already member of the team", () => {
    const joiningTeam = { member: shogosse, team: "soft" };
    it("should apply without issue", async () => {
      expect(joinTeam.apply(joiningTeam)).resolves.ok;
    });
    it("should not publish a team joined event", async () => {
      await joinTeam.apply(joiningTeam);

      expect(events.all).toHaveLength(0);
    });
    it("should stay member of the team", async () => {
      await joinTeam.apply(joiningTeam);

      expect(memberships.membersOf(joiningTeam.team)).toContainEqual(shogosse);
    });
  });
  describe("when the team does not exist", () => {
    it("should indicate that the team does not exist", async () => {
      const joiningTeam = { member: shogosse, team: "unknown" };
      await expect(joinTeam.apply(joiningTeam)).rejects.toThrowError(
        new TeamNotFound(joiningTeam.team),
      );
    });
  });
});
