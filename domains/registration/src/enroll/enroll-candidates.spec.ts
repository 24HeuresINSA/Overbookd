import { BENEVOLE_CODE } from "@overbookd/team-constants";
import { beforeEach, describe, expect, it } from "vitest";
import {
  AlreadyEnrolledError,
  Candidate,
  CANDIDATE_ENROLLED,
  EnrollCandidates,
  EnrollingCandidates,
} from "./enroll-candidates.js";
import { InMemoryMemberships } from "./memberships.inmemory.js";
import { InMemoryEvents } from "./events.inmemory.js";

const shogosse = { id: 1, name: "Lea (Shogosse) Mauyno" };
const noel = { id: 2, name: "Noel Ertsemud" };
const antony = { id: 3, name: "Antony (Dracoon) Pirony" };
const samuel = { id: 4, name: "Samuel Lareine" };
const valerie = { id: 5, name: "Valerie (Val) Basdufront" };

let enrollCandidates: EnrollCandidates;
let memberships: InMemoryMemberships;
let events: InMemoryEvents;

describe("Enroll candidates to a joinable team", () => {
  beforeEach(() => {
    memberships = new InMemoryMemberships();
    events = new InMemoryEvents();
    enrollCandidates = new EnrollCandidates(memberships, events);
  });
  describe.each<EnrollingCandidates & { names: string }>([
    { team: "hard", candidates: [shogosse], names: shogosse.name },
    {
      team: "hard",
      candidates: [shogosse, noel, antony],
      names: `${shogosse.name}, ${noel.name} and ${antony.name}`,
    },
    { team: "soft", candidates: [samuel], names: samuel.name },
    {
      team: "soft",
      candidates: [samuel, valerie],
      names: `${samuel.name} and ${valerie.name}`,
    },
  ])("when enrolling $names to $team", ({ team, candidates }) => {
    it("should apply without issues", async () => {
      await expect(enrollCandidates.apply({ candidates, team })).resolves.ok;
    });
    it(`should set all candidates as ${team} members`, async () => {
      await enrollCandidates.apply({ candidates, team });
      candidates.every((candidate) =>
        expect(memberships.membersOf(team).includes(candidate)).toBe(true),
      );
    });
    it(`should publish ${candidates.length} enrolled candidates event(s)`, async () => {
      await enrollCandidates.apply({ candidates, team });
      expect(events.all).toHaveLength(candidates.length);
    });
    it(`should list all candidates as ${BENEVOLE_CODE} members`, async () => {
      await enrollCandidates.apply({ candidates, team });
      candidates.every((candidate) =>
        expect(memberships.membersOf(BENEVOLE_CODE).includes(candidate)).toBe(
          true,
        ),
      );
    });
  });
  describe("when enrolling some candidates as hard and then some as soft", () => {
    it("should list all candidates as benevole", async () => {
      const hardCandidates = [shogosse, noel];
      const softCandidates = [samuel, valerie];
      await enrollCandidates.apply({
        candidates: hardCandidates,
        team: "hard",
      });
      await enrollCandidates.apply({
        candidates: softCandidates,
        team: "soft",
      });
      const allCandidates = [...hardCandidates, ...softCandidates];
      allCandidates.every((candidate) =>
        expect(memberships.membersOf(BENEVOLE_CODE).includes(candidate)).toBe(
          true,
        ),
      );
    });
  });
  describe.each<EnrollingCandidates & { alreadyEnrolled: Candidate[] }>([
    {
      team: "soft",
      candidates: [valerie, shogosse],
      alreadyEnrolled: [shogosse],
    },
    {
      team: "hard",
      candidates: [noel, antony, samuel, valerie],
      alreadyEnrolled: [samuel, valerie],
    },
  ])(
    "when enrolling candidates with at least one of them already enrolled on the other team",
    ({ team, candidates, alreadyEnrolled }) => {
      beforeEach(() => {
        memberships = new InMemoryMemberships(
          new Map([
            ["hard", [shogosse]],
            ["soft", [samuel, valerie]],
            [BENEVOLE_CODE, [shogosse, samuel, valerie]],
          ]),
        );
        enrollCandidates = new EnrollCandidates(memberships, events);
      });
      it("should indicate some candidates are already enrolled", async () => {
        await expect(
          enrollCandidates.apply({ team, candidates }),
        ).rejects.toThrow(new AlreadyEnrolledError(alreadyEnrolled));
      });
    },
  );
  describe("when enrolling candidates with at least on of them already enrolled on the same team", () => {
    beforeEach(() => {
      memberships = new InMemoryMemberships(
        new Map([
          ["hard", [shogosse]],
          ["soft", [samuel, valerie]],
          [BENEVOLE_CODE, [shogosse, samuel, valerie]],
        ]),
      );
      enrollCandidates = new EnrollCandidates(memberships, events);
    });
    const enrolling: EnrollingCandidates = {
      team: "hard",
      candidates: [shogosse, noel],
    };
    it("should apply without issue", async () => {
      await expect(enrollCandidates.apply(enrolling)).resolves.ok;
    });
    it("should generate enrolled candidate event only for candidates not already enrolled", async () => {
      const data = { candidate: noel, team: "hard" };
      const expectedEvent = { type: CANDIDATE_ENROLLED, data };

      await enrollCandidates.apply(enrolling);

      expect(events.all).toHaveLength(1);
      expect(events.all).toContainEqual(expectedEvent);
    });
    it('should list all candidates as "hard" team member', async () => {
      await enrollCandidates.apply(enrolling);
      expect(memberships.membersOf("hard")).toContainEqual(noel);
      expect(memberships.membersOf("hard")).toContainEqual(shogosse);
    });
  });
});
