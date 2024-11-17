import { beforeEach, describe, expect, it } from "vitest";
import { TeamNotFound } from "../access-manager.error";
import { InMemoryEvents } from "./events.inmemory";
import { JoinTeam, Member, Team, TEAM_JOINED } from "./join-team";
import { InMemoryTeams } from "./teams.inmemory";
import { InMemoryUsers } from "./users.inmemory";

const shogosse = { id: 1, name: "Lea (Shogosse) Mauyno" };
const noel = { id: 2, name: "Noel Estremud" };

let joinTeam: JoinTeam;
let events: InMemoryEvents;
let users: InMemoryUsers;
let teams: InMemoryTeams;
const initMembership = (): Map<Team, Member[]> =>
  new Map([
    ["soft", [shogosse]],
    ["hard", [noel]],
    ["conducteur", [noel]],
  ]);

const existingTeams = [
  "soft",
  "hard",
  "confiance",
  "conducteur",
  "conducteur FEN",
];

describe("Join team", () => {
  beforeEach(() => {
    events = new InMemoryEvents();
    users = new InMemoryUsers(initMembership());
    teams = new InMemoryTeams(existingTeams);
    joinTeam = new JoinTeam(users, teams, events);
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
      it("should be member of the team", async () => {
        await joinTeam.apply(joiningTeam);

        expect(users.membersOf(team)).toContainEqual(member);
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
